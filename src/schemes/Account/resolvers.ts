import { Context } from "../../main";
import { getAccountInfo } from "../../services/AccountService";

export default {
    Query: {
        async getAccountInfo(parent: {}, args: { accountId: string }, context: Context) {
            return getAccountInfo(context.db, args.accountId);
        },
    },
}