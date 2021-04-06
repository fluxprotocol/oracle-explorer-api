import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { PaginationFilters, PaginationResult } from "../models/PaginationResult";
import { Transaction } from "../models/Transaction";

export const TRANSACTIONS_COLLECTION_NAME = 'transactions';

export type TransactionQueryOptions = PaginationFilters;

export function queryTransactions(db: Db, query: FilterQuery<Transaction>, options: Partial<TransactionQueryOptions> = {}): AggregationCursor<Transaction> {
    const collection = db.collection<Transaction>(TRANSACTIONS_COLLECTION_NAME);

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

export async function queryTransactionsAsPagination(db: Db, query: FilterQuery<Transaction>, options: Partial<TransactionQueryOptions>): Promise<PaginationResult<Transaction>> {
    const collection = db.collection<Transaction>(TRANSACTIONS_COLLECTION_NAME);
    const finalOptions: TransactionQueryOptions = {
        ...options,
        limit: options.limit ?? 10,
        offset: options.offset ?? 0,
    };

    const cursor = queryTransactions(db, query, finalOptions)

    return {
        items: await cursor.toArray(),
        total: await collection.countDocuments(query),
    };
}

export async function getTransactionById(db: Db, id: string): Promise<Transaction | null> {
    try {
        const collection = db.collection<Transaction>(TRANSACTIONS_COLLECTION_NAME);
        const query: FilterQuery<Transaction> = {
            id,
        };

        return collection.findOne<Transaction>(query);
    } catch (error) {
        console.error('[getTransactionById]', error);
        return null;
    }
}