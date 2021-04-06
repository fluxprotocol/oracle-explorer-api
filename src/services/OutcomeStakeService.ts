import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { OutcomeStake } from "../models/OutcomeStake";

export const OUTCOME_STAKES_COLLECTION_NAME = 'outcome_stakes';


export function queryOutcomeStakes(db: Db, query: FilterQuery<OutcomeStake>): AggregationCursor<OutcomeStake> {
    const collection = db.collection<OutcomeStake>(OUTCOME_STAKES_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $match: query,
        },
    ];

    return collection.aggregate(pipeline);
}
