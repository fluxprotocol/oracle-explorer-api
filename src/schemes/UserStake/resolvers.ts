import { Context } from "../../main";
import { DataRequest } from "../../models/DataRequest";
import { PaginationResult } from "../../models/PaginationResult";
import { UserStake } from "../../models/UserStake";
import { getClaimByRequestId } from "../../services/ClaimService";
import { getDataRequestById } from "../../services/DataRequestService";
import { transformOutcomeToString } from "../../services/OutcomeService";
import { getUnclaimedUserStakes, getUserStakesByRequestId, queryUserStakesAsPagination } from "../../services/UserStakesService";

export default {
    UserStake: {
        async data_request(parent: UserStake, args: {}, context: Context): Promise<DataRequest | null> {
            if (parent.data_request) {
                return {
                    ...parent.data_request,
                    finalized_outcome: parent.data_request.finalized_outcome ? transformOutcomeToString(parent.data_request.finalized_outcome) : null,
                };
            }
            
            return getDataRequestById(context.db, parent.data_request_id);
        },
    },
    Query: {
        async getUserStakesByRequestId(parent: {}, args: { id: string, accountId?: string}, context: Context): Promise<UserStake[]> {
            return getUserStakesByRequestId(context.db, args.id, args.accountId);
        },

        async getUserStakes(parent: {}, args: { accountId: string, limit?: number, offset?: number }, context: Context): Promise<PaginationResult<UserStake>> {
            return queryUserStakesAsPagination(context.db, {
                account_id: args.accountId,
            }, {
                limit: args.limit,
                offset: args.offset,
            });
        },

        async getUnclaimedStakes(parent: {}, args: { accountId: string }, context: Context): Promise<UserStake[]>  {
            return getUnclaimedUserStakes(context.db, args.accountId);
        }
    }
}