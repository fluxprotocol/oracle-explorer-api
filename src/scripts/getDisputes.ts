import bootDatabase from "../database";
import { queryUserStakes } from "../services/UserStakesService";
import { transformOutcomeToString } from '../services/OutcomeService';

async function getDisputes() {
    const db = await bootDatabase();
    const result = queryUserStakes(db, {}, {
        limit: 100,
        sortId: -1,
    });

    const disputedIds: any[] = [];

    await result.forEach((item) => {
        if (item.round > 0) {
            disputedIds.push({
                id: item.data_request_id,
                account: item.account_id,
                answer: transformOutcomeToString(item.outcome),
            });
        }
    });

    console.log('[] disputedIds -> ', disputedIds);

    process.exit(0);
}

getDisputes();
