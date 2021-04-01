import { FilterQuery } from "mongodb";
import { Context } from "../../main";
import { DataRequest } from "../../models/DataRequest";
import { getDataRequestById, queryDataRequestsAsPagination } from "../../services/DataRequestService";
import { queryResolutionWindows } from "../../services/ResolutionWindowService";

export default {
    DataRequest: {
        resolution_windows: async (parent: DataRequest, args: {}, context: Context) => {
            return queryResolutionWindows(context.db, {
                dr_id: parent.id,
            }).toArray();
        },
    },
    Query: {
        getDataRequest: async (parent: {}, args: { id: string }, context: Context) => {
            return getDataRequestById(context.db, args.id);
        },
        
        getDataRequests: async (parent: {}, args: { limit: number, offset: number }, context: Context) => {
            const query: FilterQuery<DataRequest> = {};

            return queryDataRequestsAsPagination(context.db, query, {
                limit: args.limit,
                offset: args.offset,
            });
        }
    },
}