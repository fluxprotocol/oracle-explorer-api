import { Context } from "../../main";
import { getWhitelistItemById, queryWhitelistAsPagination } from "../../services/WhitelistService";

export default {
    Query: {
        getWhitelistItem: async (parent: {}, args: { id: string }, context: Context) => {
            return getWhitelistItemById(context.db, args.id);
        },

        getWhitelistItems: async (parent: {}, args: { limit: number, offset: number }, context: Context) => {
            return queryWhitelistAsPagination(context.db, {}, {
                limit: args.limit,
                offset: args.offset,
            });
        },
    },
}