import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { DataRequest } from "../models/DataRequest";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { transformOutcomeToString } from "./OutcomeService";

export const DATA_REQUEST_COLLECTION_NAME = 'data_requests';

export interface DataRequestQueryOptions extends PaginationFilters {
    includeResolutionWindow: boolean;
    includeWhitelist: boolean;
    sortOnDate: boolean;
}

export function queryDataRequests(db: Db, query: FilterQuery<DataRequest>, options: Partial<DataRequestQueryOptions> = {}): AggregationCursor<DataRequest> {
    const collection = db.collection<DataRequest>(DATA_REQUEST_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $addFields: {
                idInt: {
                    $convert: { input: '$id', to: 'int' },
                }
            },
        },
        {
            $match: query,
        },
    ];

    if (options.sortOnDate) {
        pipeline.push({
            $sort: {
                date: -1,
            }
        });
    }

    if (options.includeResolutionWindow) {
        pipeline.push({
            $lookup: {
                from: 'resolution_windows',
                localField: 'id',
                foreignField: 'dr_id',
                as: 'resolution_windows',
            }
        });
    }

    if (options.includeWhitelist) {
        pipeline.push({
            $lookup: {
                from: 'whitelist',
                localField: 'requestor',
                foreignField: 'account_id',
                as: 'whitelist_item',
            }
        });

        pipeline.push({
            $addFields: {
                whitelist_item: {
                    '$arrayElemAt': ['$whitelist_item', 0],
                }
            }
        });
    }

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
    try {
        const collection = db.collection<DataRequest>(DATA_REQUEST_COLLECTION_NAME);
        const finalOptions: DataRequestQueryOptions = {
            ...options,
            limit: options.limit ?? 10,
            offset: options.offset ?? 0,
            includeResolutionWindow: false,
            sortOnDate: true,
            includeWhitelist: false,
        };
    
        const cursor = queryDataRequests(db, query, finalOptions);
        const items = await cursor.toArray();
    
        return {
            items: items.map(item => ({
                ...item,
                finalized_outcome: item.finalized_outcome ? transformOutcomeToString(item.finalized_outcome) : null,
            })),
            total: await collection.countDocuments(query),
        };
    } catch (error) {
        console.error('[queryDataRequestsAsPagination]', error);
        return {
            items: [],
            total: 0,
        }
    }
}

export async function getDataRequestById(db: Db, id: string): Promise<DataRequest | null> {
    try {
        const collection = db.collection(DATA_REQUEST_COLLECTION_NAME);
        const query: FilterQuery<DataRequest> = {
            id,
        };

        const result = await collection.findOne<DataRequest>(query);

        if (!result) {
            return null;
        }

        return {
            ...result,
            finalized_outcome: result.finalized_outcome ? transformOutcomeToString(result.finalized_outcome) : null,
        };
    } catch (error) {
        console.error('[getDataRequestById]', error);
        return null;
    }
}