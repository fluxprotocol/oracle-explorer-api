import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { UserStake } from "../models/UserStake";
import { transformOutcomeToString } from "./OutcomeService";

export const USER_STAKES_COLLECTION_NAME = 'user_stakes';

export interface UserStakeQueryOptions extends PaginationFilters {
    includeDataRequest: boolean;
    includeClaim: boolean;
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

    if (options.includeClaim) {
        pipeline.push({
            $lookup: {
                from: 'claims',
                localField: 'data_request_id',
                foreignField: 'data_request_id',
                as: 'claims',
            }
        });

        pipeline.push({
            $addFields: {
                claim: {
                    '$arrayElemAt': ['$claims', 0],
                }
            },
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
        includeClaim: false,
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

export async function getUnclaimedUserStakes(db: Db, accountId: string): Promise<UserStake[]> {
    const query: FilterQuery<UserStake> = {
        account_id: accountId,
    };

    const stakesCursor = queryUserStakes(db, query, {
        includeClaim: true,
        includeDataRequest: true,
    });

    const result: UserStake[] = [];

    for await (const stake of stakesCursor) {
        // Request has not yet finished
        if (!stake.data_request?.finalized_outcome) {
            continue;
        }

        // Already claimed
        if (stake.claim) {
            continue;
        }

        const outcomeStr = transformOutcomeToString(stake.outcome);
        const finalizedOutcome = transformOutcomeToString(stake.data_request.finalized_outcome);

        if (outcomeStr !== finalizedOutcome) {
            continue;
        }

        result.push({
            ...stake,
            outcome: transformOutcomeToString(stake.outcome),
        });
    }

    return result;
}
