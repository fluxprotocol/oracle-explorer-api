import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { WhitelistItem } from "../models/WhitelistItem";

export const WHITE_LIST_COLLECTION_NAME = 'whitelist';

export type WhitelistQueryOptions = PaginationFilters;

export function queryWhitelist(db: Db, query: FilterQuery<WhitelistItem>, options: Partial<WhitelistQueryOptions> = {}): AggregationCursor<WhitelistItem> {
    const collection = db.collection<WhitelistItem>(WHITE_LIST_COLLECTION_NAME);

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

export async function queryWhitelistAsPagination(db: Db, query: FilterQuery<WhitelistItem>, options: Partial<WhitelistQueryOptions>): Promise<PaginationResult<WhitelistItem>> {
    const collection = db.collection<WhitelistItem>(WHITE_LIST_COLLECTION_NAME);
    const finalOptions: WhitelistQueryOptions = {
        ...options,
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
    };

    const cursor = queryWhitelist(db, query, finalOptions)

    return {
        items: await cursor.toArray(),
        total: await collection.countDocuments(query),
    };
}

export async function getWhitelistItemById(db: Db, id: string): Promise<WhitelistItem | null> {
    try {
        const collection = db.collection<WhitelistItem>(WHITE_LIST_COLLECTION_NAME);
        const query: FilterQuery<WhitelistItem> = {
            id,
        };

        return collection.findOne<WhitelistItem>(query);
    } catch (error) {
        console.error('[getWhitelistItemById]', error);
        return null;
    }
}