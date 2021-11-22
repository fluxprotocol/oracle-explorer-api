import { Context } from "../../main";
import { ActiveValidator } from "../../models/ActiveValidator";
import { PaginationResult } from "../../models/PaginationResult";
import { UserStake } from "../../models/UserStake";
import { getActiveValidators } from "../../services/ValidatorService";

export default {
    Query: {
        async getActiveValidators(parent: {}, args: { limit?: number, offset?: number }, context: Context): Promise<PaginationResult<ActiveValidator>> {
            const result = await getActiveValidators(context.db);

            return {
                total: result.length,
                items: result,
            }
        },
    }
}