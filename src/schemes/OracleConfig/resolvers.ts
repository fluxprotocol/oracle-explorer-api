import { Context } from "../../main";
import { getOracleConfigById, queryOracleConfigAsPagination } from "../../services/OracleConfigService";

export default {
    Query: {
        getOracleConfig: async (parent: {}, args: { id: string }, context: Context) => {
            return getOracleConfigById(context.db, args.id);
        },
        getOracleConfigs: async (parent: {}, args: { limit: number, offset: number }, context: Context) => {
            return queryOracleConfigAsPagination(context.db, {}, {
                limit: args.limit,
                offset: args.offset,
            });
        },
    },
}