import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { Claim } from "../models/Claim";
import { PaginationFilters } from "../models/PaginationResult";

export const CLAIM_COLLECTION_NAME = 'claims';

export type ClaimQueryOptions = PaginationFilters;

export function queryClaims(db: Db, query: FilterQuery<Claim>, options: Partial<ClaimQueryOptions> = {}): AggregationCursor<Claim> {
    const collection = db.collection<Claim>(CLAIM_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $match: query,
        },
        {
            $sort: {
                date: -1,
            }
        },
    ];
    
    return collection.aggregate(pipeline);
}