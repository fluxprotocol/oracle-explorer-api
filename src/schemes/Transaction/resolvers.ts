import { Context } from "../../main";
import { getTransactionById, queryTransactionsAsPagination } from "../../services/TransactionService";

export default {
    Query: {
        getTransaction: async (parent: {}, args: { id: string }, context: Context) => {
            return getTransactionById(context.db, args.id);
        },

        getTransactions: async (parent: {}, args: { limit: number, offset: number }, context: Context) => {
            return queryTransactionsAsPagination(context.db, {}, {
                limit: args.limit,
                offset: args.offset,
            });
        },
    },
}