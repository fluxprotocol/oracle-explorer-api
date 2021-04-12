import { AggregationCursor, Db, FilterQuery } from "mongodb";
import { ResolutionWindow } from "../models/ResolutionWindow";
import { transformOutcomeToString } from "./OutcomeService";

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

export async function getResolutionWindowsByRequestId(db: Db, requestId: string) {
    const resolutionWindows = await queryResolutionWindows(db, {
        dr_id: requestId,
    }).toArray();

    return resolutionWindows.map((resolutionWindow) => ({
        ...resolutionWindow,
        bonded_outcome: resolutionWindow.bonded_outcome ? transformOutcomeToString(resolutionWindow.bonded_outcome) : null,
    }));
}