import Big from "big.js";
import { Db } from "mongodb";
import { Account } from "../models/Account";
import { queryUserStakes } from "./UserStakesService";

export async function getAccountInfo(db: Db, accountId: string): Promise<Account> {
    try {
        const userStakes = await queryUserStakes(db, {
            account_id: accountId,
        }, { 
            includeDataRequest: true 
        }).toArray();

        let activeStaking = new Big(0);
        let totalStaked = new Big(0);

        userStakes.forEach((stake) => {
            totalStaked = totalStaked.add(stake.total_stake);

            if (stake.data_request && !stake.data_request.finalized_outcome) {
                activeStaking = activeStaking.add(stake.total_stake);
            }
        });

        return {
            active_staking: activeStaking.toString(),
            total_staked: totalStaked.toString(),
        }
    } catch(error) {
        console.error('[getAccountInfo]', error);

        return {
            active_staking: '0',
            total_staked: '0',
        }
    }
}