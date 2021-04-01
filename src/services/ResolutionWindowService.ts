import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { ResolutionWindow } from "../models/ResolutionWindow";

export const RESOLUTION_WINDOWS_COLLECTION_NAME = 'resolution_windows';

export function queryResolutionWindows(db: Db, query: FilterQuery<ResolutionWindow>): AggregationCursor<ResolutionWindow> {
    const collection = db.collection<ResolutionWindow>(RESOLUTION_WINDOWS_COLLECTION_NAME);

    const pipeline: object[] = [
        {
            $match: query,
        },
    ];

    return collection.aggregate(pipeline);
}
