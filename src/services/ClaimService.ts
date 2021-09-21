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

    if (typeof options.limit !== 'undefined' && typeof options.offset !== 'undefined') {
        pipeline.push({
            '$limit': options.offset + options.limit,
        });
    }

    if (typeof options.offset !== 'undefined') {
        pipeline.push({
            '$skip': options.offset,
        });
    }
    
    return collection.aggregate(pipeline);
}

export async function getClaimByRequestId(db: Db, accountId: string, requestId: string): Promise<Claim | null> {
    try {
        const collection = db.collection<Claim>(CLAIM_COLLECTION_NAME);
        const claim = await collection.findOne({
            account_id: accountId,
            data_request_id: requestId,
        });
    
        return claim;
    } catch(error) {
        console.error('[getClaimByRequestId]', error);
        return null;
    }
}