import { FilterQuery } from "mongodb";
import { Context } from "../../main";
import { Claim } from "../../models/Claim";
import { DataRequest } from "../../models/DataRequest";
import { UserStake } from "../../models/UserStake";
import { WhitelistItem } from "../../models/WhitelistItem";
import { getClaimByRequestId } from "../../services/ClaimService";
import { getDataRequestById, queryDataRequests, queryDataRequestsAsPagination } from "../../services/DataRequestService";
import { getOracleConfigById } from "../../services/OracleConfigService";
import { transformOutcomeToString } from "../../services/OutcomeService";
import { getResolutionWindowsByRequestId } from "../../services/ResolutionWindowService";
import { getUserStakesByRequestId } from "../../services/UserStakesService";
import { getWhitelistItemByContractId, getWhitelistItemById } from "../../services/WhitelistService";

export default {
    DataRequest: {
        finalized_outcome: async (parent: DataRequest, args: {}, context: Context) => {
            return parent.finalized_outcome ? transformOutcomeToString(parent.finalized_outcome) : null;
        },

        resolution_windows: async (parent: DataRequest, args: {}, context: Context) => {
            if (parent.resolution_windows) {
                return parent.resolution_windows;
            }

            return getResolutionWindowsByRequestId(context.db, parent.id);
        },

        config: async (parent: DataRequest, args: {}, context: Context) => {
            if (parent.config) {
                return parent.config;
            }

            return getOracleConfigById(context.db, parent.global_config_id);
        },

        data_type: async (parent: DataRequest) => {
            return parent.data_type === "String" ? parent.data_type : JSON.stringify(parent.data_type);
        },

        async whitelist_item(parent: DataRequest, args: {}, context: Context): Promise<WhitelistItem | null> {
            if (parent.whitelist_item) {
                return parent.whitelist_item;
            }

            return getWhitelistItemByContractId(context.db, parent.requester_account_id);
        },

        async claim(parent: DataRequest, args: { accountId: string }, context: Context): Promise<Claim | null> {
            return getClaimByRequestId(context.db, args.accountId, parent.id);
        },

        async account_stakes(parent: DataRequest, args: { accountId?: string }, context: Context): Promise<UserStake[]> {
            if (!args.accountId) return [];

            return getUserStakesByRequestId(context.db, parent.id, args.accountId);
        },
    },
    Query: {
        getDataRequest: async (parent: {}, args: { id: string }, context: Context) => {
            return getDataRequestById(context.db, args.id);
        },
        
        getDataRequests: async (parent: {}, args: { limit: number, offset: number, onlyArbitratorRequests: boolean, tags?: string[], requestor?: string }, context: Context) => {
            const query: FilterQuery<DataRequest> = {};

            if (args.onlyArbitratorRequests) {
                query['sources.0'] = {
                    $exists: false
                }
            }

            if (args.tags) {
                query.tags = {
                    $in: args.tags,
                }
            }

            if (args.requestor) {
                query.requester_account_id = args.requestor;
            }

            return queryDataRequestsAsPagination(context.db, query, {
                limit: args.limit,
                offset: args.offset,
            });
        },
    },
}