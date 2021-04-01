import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { DataRequest } from "../models/DataRequest";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";

export const DATA_REQUEST_COLLECTION_NAME = 'data_requests';

export type DataRequestQueryOptions = PaginationFilters;

export function queryDataRequests(db: Db, query: FilterQuery<DataRequest>, options: Partial<DataRequestQueryOptions> = {}): AggregationCursor<DataRequest> {
    const collection = db.collection<DataRequest>(DATA_REQUEST_COLLECTION_NAME);

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

        pipeline.push({
            '$skip': options.offset,
        });
    }

    return collection.aggregate(pipeline);
}

export async function queryDataRequestsAsPagination(db: Db, query: FilterQuery<DataRequest>, options: Partial<DataRequestQueryOptions>): Promise<PaginationResult<DataRequest>> {
    const collection = db.collection<DataRequest>(DATA_REQUEST_COLLECTION_NAME);
    const finalOptions: DataRequestQueryOptions = {
        ...options,
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
    };

    const cursor = queryDataRequests(db, query, finalOptions)

    return {
        items: await cursor.toArray(),
        total: await collection.countDocuments(query),
    };
}

export async function getDataRequestById(db: Db, id: string): Promise<DataRequest | null> {
    try {
        const collection = db.collection(DATA_REQUEST_COLLECTION_NAME);
        const query: FilterQuery<DataRequest> = {
            id,
        };

        return collection.findOne<DataRequest>(query);
    } catch (error) {
        console.error('[getDataRequestById]', error);
        return null;
    }
}