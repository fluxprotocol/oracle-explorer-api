import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { UserStake } from "../models/UserStake";
import { transformOutcomeToString } from "./OutcomeService";

export const USER_STAKES_COLLECTION_NAME = 'user_stakes';

export interface UserStakeQueryOptions extends PaginationFilters {
    includeDataRequest: boolean;
}

export function queryUserStakes(db: Db, query: FilterQuery<UserStake>, options: Partial<UserStakeQueryOptions> = {}): AggregationCursor<UserStake> {
    const collection = db.collection<UserStake>(USER_STAKES_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $match: query,
        },
        {
            $sort: {
                _id: -1,
            }
        },
    ];

    if (options.includeDataRequest) {
        pipeline.push({
            $lookup: {
                from: 'data_requests',
                localField: 'data_request_id',
                foreignField: 'id',
                as: 'data_requests',
            }
        });

        pipeline.push({
            $addFields: {
                data_request: {
                    '$arrayElemAt': ['$data_requests', 0],
                }
            },
        });

        pipeline.push({
            $unset: ['data_requests'],
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

export async function queryUserStakesAsPagination(db: Db, query: FilterQuery<UserStake>, options: Partial<UserStakeQueryOptions>): Promise<PaginationResult<UserStake>> {
    const collection = db.collection<UserStake>(USER_STAKES_COLLECTION_NAME);
    const finalOptions: UserStakeQueryOptions = {
        ...options,
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
        includeDataRequest: true,
    };

    const cursor = queryUserStakes(db, query, finalOptions);
    const items = await cursor.toArray();

    return {
        items: items.map(item => ({
            ...item,
            outcome: transformOutcomeToString(item.outcome),
        })),
        total: await collection.countDocuments(query),
    };
}