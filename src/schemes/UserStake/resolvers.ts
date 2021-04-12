import { FilterQuery } from "mongodb";
import { Context } from "../../main";
import { UserStake } from "../../models/UserStake";
import { getUserStakesByRequestId, queryUserStakes } from "../../services/UserStakesService";

export default {
    Query: {
        async getUserStakesByRequestId(parent: {}, args: { id: string, accountId?: string}, context: Context): Promise<UserStake[]> {
            return getUserStakesByRequestId(context.db, args.id, args.accountId);
        }
    }
}