import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { UserStake } from "../models/UserStake";

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
