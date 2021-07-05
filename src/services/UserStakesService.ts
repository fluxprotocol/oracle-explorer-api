import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { isSameOutcome } from "../models/Outcome";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { UserStake } from "../models/UserStake";
import { transformOutcomeToString } from "./OutcomeService";

export const USER_STAKES_COLLECTION_NAME = 'user_stakes';

export interface UserStakeQueryOptions extends PaginationFilters {
    includeDataRequest: boolean;
    includeClaim: boolean;
    includeResolutionWindow: boolean;
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

        pipeline.push({
            $unset: ['claims'],
        });
    }

    if (options.includeResolutionWindow) {
        pipeline.push({
            $lookup: {
                from: 'resolution_windows',
                localField: 'data_request_id',
                foreignField: 'dr_id',
                as: 'resolution_windows',
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

export async function getUserStakesByRequestId(db: Db, requestId: string, accountId?: string): Promise<UserStake[]> {
    const query: FilterQuery<UserStake> = {
        data_request_id: requestId,
    };

    const options: Partial<UserStakeQueryOptions> = {};

    if (accountId) {
        query.account_id = accountId;
        options.includeClaim = true;
    }

    const stakes = await queryUserStakes(db, query, options).toArray();

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
        includeResolutionWindow: false,
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
        includeResolutionWindow: true,
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

        const resolutionWindowStakedOn = stake.resolution_windows?.find(rw => rw.round === stake.round);

        // Sanity check, should never happen
        if (!resolutionWindowStakedOn) {
            continue;
        }

        if (resolutionWindowStakedOn.bonded_outcome) {
            if (isSameOutcome(resolutionWindowStakedOn.bonded_outcome, stake.outcome)) {
                // The window was bonded with our stake. We can only claim it back if the finalized outcome
                // is the same as our current staked outcome. Otherwise it's slashed
                if (!isSameOutcome(stake.data_request.finalized_outcome, stake.outcome)) {
                    continue;
                }
            }
        }

        // There is no bonded outcome on the window or the user has staked correctly.
        // Either way the user is able to claim their tokens back.
        result.push({
            ...stake,
            outcome: transformOutcomeToString(stake.outcome),
        });
    }

    return result;
}
