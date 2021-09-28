import { Context } from "../../main";
import { getAccountAnalytics, getInvalidRequestsAnalytics } from "../../services/AnalyticsService";
import { DateMetric } from "../../services/DateService";

export default {
    Query: {
        getAccountAnalytics: async (parent: {}, args: { accountId: string, beginTimestamp: string, endTimestamp?: string, dateMetric?: DateMetric }, context: Context) => {
            return getAccountAnalytics(
                context.db, 
                args.accountId, 
                Number(args.beginTimestamp), 
                args.endTimestamp ? Number(args.endTimestamp) : new Date().getTime(),
                args.dateMetric,
            );
        },

        async getInvalidRequestsAnalytics(parent: {}, args: { accountId: string, beginTimestamp: string, endTimestamp?: string, dateMetric?: DateMetric }, context: Context) {
            return getInvalidRequestsAnalytics(
                context.db,
                args.accountId,
                Number(args.beginTimestamp),
                args.endTimestamp ? Number(args.endTimestamp) : new Date().getTime(),
                args.dateMetric,
            );
        }   
    },
}