import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { UserStake } from "../models/UserStake";
import { transformOutcomeToString } from "./OutcomeService";

export const USER_STAKES_COLLECTION_NAME = 'user_stakes';

export function queryUserStakes(db: Db, query: FilterQuery<UserStake>): AggregationCursor<UserStake> {
    const collection = db.collection<UserStake>(USER_STAKES_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $match: query,
        },
    ];

    return collection.aggregate(pipeline);
}

export async function getUserStakesByRequestId(db: Db, requestId: string, accountId?: string): Promise<UserStake[]> {
    const query: FilterQuery<UserStake> = {
        data_request_id: requestId,
    };

    if (accountId) {
        query.account_id = accountId;
    }

    const stakes = await queryUserStakes(db, query).toArray();
    return stakes.map((stake) => ({
        ...stake,
        outcome: transformOutcomeToString(stake.outcome),
    }));
}