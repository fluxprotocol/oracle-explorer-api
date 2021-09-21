import Big from "big.js";
import { Db } from "mongodb";
import { Account } from "../models/Account";
import { DbCacheEntry } from "../models/DbCacheEntry";
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
    const userStakes = await queryUserStakes(db, {
        account_id: accountId,
    }, {
        offset: userStakesOffset,
    }).toArray();

    const claimedOffset = accountInfo?.cache_offsets[CLAIM_COLLECTION_NAME] ?? 0;
    const userClaims = await queryClaims(db, {
        account_id: accountId,
    }, {
        offset: claimedOffset,
    }).toArray();

    let activeStaking = new Big(accountInfo?.active_staking ?? 0);
    let totalStaked = new Big(accountInfo?.total_staked ?? 0);
    let totalClaimed = new Big(accountInfo?.total_claimed ?? 0);

    userClaims.forEach((claim) => totalClaimed = totalClaimed.add(claim.payout));

    userStakes.forEach((stake) => {
        totalStaked = totalStaked.add(stake.total_stake);

        // if (stake.data_request && !stake.data_request.finalized_outcome) {
        //     activeStaking = activeStaking.add(stake.total_stake);
        // }
    });

    const nextStakesOffset = userStakesOffset + userStakes.length;
    const nextClaimedOffset = claimedOffset + userClaims.length;

    const finalAccountInfo: Account & DbCacheEntry = {
        account_id: accountId,
        active_staking: activeStaking.toString(),
        total_staked: totalStaked.toString(),
        total_claimed: totalClaimed.toString(),
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
        $set: finalAccountInfo,
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
            has_stakes: false,
            has_requests: false,
        }
    }
}