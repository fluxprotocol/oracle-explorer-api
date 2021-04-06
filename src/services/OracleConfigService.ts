import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { OracleConfig } from "../models/OracleConfig";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";

export const ORACLE_CONFIG_COLLECTION_NAME = 'oracle_configs';

export type OracleConfigQueryOptions = PaginationFilters;

export function queryOracleConfigs(db: Db, query: FilterQuery<OracleConfig>, options: Partial<OracleConfigQueryOptions> = {}): AggregationCursor<OracleConfig> {
    const collection = db.collection<OracleConfig>(ORACLE_CONFIG_COLLECTION_NAME);

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

export async function queryOracleConfigAsPagination(db: Db, query: FilterQuery<OracleConfig>, options: Partial<OracleConfigQueryOptions>): Promise<PaginationResult<DataRequest>> {
    const collection = db.collection<OracleConfig>(ORACLE_CONFIG_COLLECTION_NAME);
    const finalOptions: OracleConfigQueryOptions = {
        ...options,
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
    };

    const cursor = queryOracleConfigs(db, query, finalOptions)

    return {
        items: await cursor.toArray(),
        total: await collection.countDocuments(query),
    };
}

export async function getOracleConfigById(db: Db, id: string): Promise<OracleConfig | null> {
    try {
        const collection = db.collection<OracleConfig>(ORACLE_CONFIG_COLLECTION_NAME);
        const query: FilterQuery<OracleConfig> = {
            id,
        };

        return collection.findOne<OracleConfig>(query);
    } catch (error) {
        console.error('[getOracleConfigById]', error);
        return null;
    }
}