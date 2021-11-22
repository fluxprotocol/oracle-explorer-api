import { subWeeks } from "date-fns";
import { Db,  } from "mongodb";
import { ActiveValidator } from "../models/ActiveValidator";
import { queryTransactions } from "./TransactionService";

export async function getActiveValidators(db: Db) {
    const now = new Date();
    const endDate = subWeeks(now, 1);
    const input = new Date(endDate.toISOString());

    const cursor = queryTransactions(db, {
        cap_creation_date: {
            $gte: input,
        },
        type: 'Stake',
    }, {

    });

    const accounts: Map<string, ActiveValidator> = new Map();

    await cursor.forEach((item) => {
        if (accounts.has(item.account_id)) {
            return;
        }

        accounts.set(item.account_id, {
            account_id: item.account_id,
            last_activity: item.cap_creation_date.getTime().toString(),
        });
    });

    return Array.from(accounts.values());
}