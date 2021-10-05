import Big from "big.js";
import { Db } from "mongodb";
import { Account } from "../models/Account";
import { DbCacheEntry } from "../models/DbCacheEntry";
import { isSameOutcome } from "../models/Outcome";
import { CLAIM_COLLECTION_NAME, queryClaims } from "./ClaimService";
import { queryDataRequestsAsPagination } from "./DataRequestService";
import { queryUserStakes, USER_STAKES_COLLECTION_NAME } from "./UserStakesService";
import { queryWhitelist } from "./WhitelistService";

export const ACCOUNT_COLLECTION_NAME = 'accounts';

async function updateAccountInfo(db: Db, accountId: string) {
    const collection = db.collection<Account & DbCacheEntry>(ACCOUNT_COLLECTION_NAME);
    const accountInfo = await collection.findOne({
        account_id: accountId,
    });

    const userStakesOffset = accountInfo?.cache_offsets[USER_STAKES_COLLECTION_NAME] ?? 0;
    const userStakes = queryUserStakes(db, {
        account_id: accountId,
    }, {
        offset: userStakesOffset,
        includeDataRequest: true,
        sortId: 1,
    });

    const claimedOffset = accountInfo?.cache_offsets[CLAIM_COLLECTION_NAME] ?? 0;
    const userClaims = await queryClaims(db, {
        account_id: accountId,
    }, {
        offset: claimedOffset,
    }).toArray();

    let activeStaking = new Big(accountInfo?.active_staking ?? 0);
    let totalStaked = new Big(accountInfo?.total_staked ?? 0);
    let totalClaimed = new Big(accountInfo?.total_claimed ?? 0);
    let totalDisputes = new Big(accountInfo?.total_disputes ?? 0);
    let timesSlashed = new Big(accountInfo?.times_slashed ?? 0);
    let totalAmountSlashed = new Big(accountInfo?.total_amount_slashed ?? 0);

    let tempTotalStaked = new Big(totalStaked);
    let tempTotalDisputes = new Big(totalDisputes);
    let tempTimesSlashed = new Big(timesSlashed);
    let tempTotalAmountSlashed = new Big(totalAmountSlashed);

    userClaims.forEach((claim) => totalClaimed = totalClaimed.add(claim.payout));

    let nextStakesOffset = userStakesOffset;
    let userStakesIndex = 0;
    let reachedNonFinalizedStake = false;

    await userStakes.forEach((stake) => {    
        // Only move the index cursor when a data request is finalised
        // Otherwise we'll get inaccurate data regarding the slashing
        if (!stake.data_request?.finalized_outcome && !reachedNonFinalizedStake) {
            reachedNonFinalizedStake = true;
            nextStakesOffset += userStakesIndex;

            // Add remainders to the total
            totalStaked = tempTotalStaked;
            totalDisputes = tempTotalDisputes;
            timesSlashed = tempTimesSlashed;
            totalAmountSlashed = tempTotalAmountSlashed;
        }

        if (!reachedNonFinalizedStake) {
            userStakesIndex += 1;
        }

        if (stake.round > 0) {
            tempTotalStaked = tempTotalDisputes.add(1);
        }

        if (stake.data_request?.finalized_outcome) {
            if (!isSameOutcome(stake.outcome, stake.data_request.finalized_outcome)) {
                tempTimesSlashed = tempTimesSlashed.add(1);
                tempTotalAmountSlashed = tempTotalAmountSlashed.add(stake.total_stake);
            }
        }

        tempTotalStaked = tempTotalStaked.add(stake.total_stake);
    });

    if (!reachedNonFinalizedStake) {
        nextStakesOffset += userStakesIndex;

        // Add remainders to the total
        totalStaked = tempTotalStaked;
        totalDisputes = tempTotalDisputes;
        timesSlashed = tempTimesSlashed;
        totalAmountSlashed = tempTotalAmountSlashed;
    }

    const nextClaimedOffset = claimedOffset + userClaims.length;

    const finalAccountInfo: Account & DbCacheEntry = {
        account_id: accountId,
        active_staking: activeStaking.toString(),
        total_staked: totalStaked.toString(),
        total_claimed: totalClaimed.toString(),
        total_disputes: totalDisputes.toString(),
        times_slashed: timesSlashed.toString(),
        total_amount_slashed: totalAmountSlashed.toString(),
        has_stakes: totalStaked.gt(0),
        has_requests: false,
        cache_offsets: {
            [USER_STAKES_COLLECTION_NAME]: nextStakesOffset,
            [CLAIM_COLLECTION_NAME]: nextClaimedOffset,
        },
    }

    await collection.updateOne({
        account_id: accountId,
    }, {
        $set: {
            ...finalAccountInfo,
            // total_staked: reachedNonFinalizedStake ? accountInfo?.total_staked : totalStaked.toString(),
            // total_disputes: reachedNonFinalizedStake ? accountInfo?.total_disputes : totalDisputes.toString(),
            // total_amount_slashed: reachedNonFinalizedStake ? accountInfo?.total_amount_slashed : totalAmountSlashed.toString(),
            // times_slashed: reachedNonFinalizedStake ? accountInfo?.times_slashed : timesSlashed.toString(),        
        }
    }, { upsert: true });

    return finalAccountInfo;
}

export async function getAccountInfo(db: Db, accountId: string): Promise<Account> {
    try {
        const accountInfo = await updateAccountInfo(db, accountId);
        const requestorRequestsPromise = queryDataRequestsAsPagination(db, {
            requestor_account_id: accountId,
        }, {
            includeResolutionWindow: false,
            includeWhitelist: false,
            sortOnDate: false,
            offset: 0,
            limit: 1,
        })

        const whitelistItem = await queryWhitelist(db, {
            account_id: accountId,
        }).toArray();

        return {
            ...accountInfo,
            has_requests: (await requestorRequestsPromise).total > 0,
            whitelist_item: whitelistItem[0] ?? undefined,
        }
    } catch(error) {
        console.error('[getAccountInfo]', error);

        return {
            account_id: accountId,
            active_staking: '0',
            total_staked: '0',
            total_claimed: '0',
            total_disputes: '0',
            total_amount_slashed: '0',
            times_slashed: '0',
            has_stakes: false,
            has_requests: false,
        }
    }
}