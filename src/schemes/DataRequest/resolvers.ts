import { FilterQuery } from "mongodb";
import { Context } from "../../main";
import { DataRequest } from "../../models/DataRequest";
import { getDataRequestById, queryDataRequestsAsPagination } from "../../services/DataRequestService";
import { getOracleConfigById } from "../../services/OracleConfigService";
import { getResolutionWindowsByRequestId } from "../../services/ResolutionWindowService";

export default {
    DataRequest: {
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
    },
    Query: {
        getDataRequest: async (parent: {}, args: { id: string }, context: Context) => {
            return getDataRequestById(context.db, args.id);
        },
        
        getDataRequests: async (parent: {}, args: { limit: number, offset: number, onlyArbitratorRequests: boolean }, context: Context) => {
            const query: FilterQuery<DataRequest> = {};

            if (args.onlyArbitratorRequests) {
                query['sources.0'] = {
                    $exists: false
                }
            }

            return queryDataRequestsAsPagination(context.db, query, {
                limit: args.limit,
                offset: args.offset,
            });
        }
    },
}