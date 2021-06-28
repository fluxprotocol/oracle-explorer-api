import Big from "big.js";
import { Db } from "mongodb";
import { Account } from "../models/Account";
import { queryUserStakes } from "./UserStakesService";
import { getWhitelistItemById, queryWhitelist } from "./WhitelistService";

export async function getAccountInfo(db: Db, accountId: string): Promise<Account> {
    try {
        const userStakes = await queryUserStakes(db, {
            account_id: accountId,
        }, { 
            includeDataRequest: true,
            includeClaim: true,
        }).toArray();

        let activeStaking = new Big(0);
        let totalStaked = new Big(0);
        let totalClaimed = new Big(0);

        userStakes.forEach((stake) => {
            totalStaked = totalStaked.add(stake.total_stake);

            if (stake.data_request && !stake.data_request.finalized_outcome) {
                activeStaking = activeStaking.add(stake.total_stake);
            }

            if (stake.claim) {
                totalClaimed = totalClaimed.add(stake.claim.payout);
            }
        });

        const whitelistItem = await queryWhitelist(db, {
            contract_entry: accountId,
        }).toArray();

        return {
            active_staking: activeStaking.toString(),
            total_staked: totalStaked.toString(),
            total_claimed: totalClaimed.toString(),
            whitelist_item: whitelistItem[0] ?? undefined,
        }
    } catch(error) {
        console.error('[getAccountInfo]', error);

        return {
            active_staking: '0',
            total_staked: '0',
            total_claimed: '0',
        }
    }
}