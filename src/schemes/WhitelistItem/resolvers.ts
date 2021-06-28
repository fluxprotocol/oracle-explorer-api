import { Context } from "../../main";
import { WhitelistItem } from "../../models/WhitelistItem";
import { getWhitelistItemById, queryWhitelistAsPagination } from "../../services/WhitelistService";

export default {
    WhitelistItem: {
        custom_fee: async (parent: WhitelistItem) => {
            if (parent.custom_fee && typeof parent.custom_fee !== 'string') {
                return parent.custom_fee = JSON.stringify(parent.custom_fee);
            }

            return parent.custom_fee;
        }
    },
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