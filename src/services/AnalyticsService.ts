import Big from "big.js";
import format from "date-fns/format";
import { Db } from "mongodb";
import { AnalyticsPoint } from "../models/AccountAnalytics";
import { queryClaims } from "./ClaimService";
import { queryDataRequests } from "./DataRequestService";
import { createEmptyDataPoints, DateMetric, getDateMetricFormat } from "./DateService";

export async function getAccountAnalytics(db: Db, accountId: string, beginTimestamp: number, endTimestamp: number, metric: DateMetric = DateMetric.week) {
    try {
        const userClaims = queryClaims(db, {
            account_id: accountId,
            date: {
                $gt: beginTimestamp.toString(),
                $lt: endTimestamp.toString(),
            },
        });

        const dataPoints = new Map<string, AnalyticsPoint>();
        const dateFormat = getDateMetricFormat(metric);

        await userClaims.forEach((claim) => {
            const pointKey = format(new Date(Number(claim.date)), dateFormat);
            const dataPoint = dataPoints.get(pointKey);

            dataPoints.set(pointKey, {
                key: pointKey,
                data: [
                    new Big(claim.payout).add(dataPoint?.data[0] ?? 0).toString(),
                    new Big(claim.fee_profit).add(dataPoint?.data[1] ?? 0).toString(),
                ],
            });
        });
        
        return Array.from(dataPoints.values());
    } catch (error) {
        console.error('[getAccountAnalytics]', error);
        return [];
    }
}

export async function getInvalidRequestsAnalytics(db: Db, accountId: string, beginTimestamp: number, endTimestamp: number, metric: DateMetric = DateMetric.week) {
    try {
        const requests = queryDataRequests(db, {
            requestor_account_id: accountId,
            finalized_outcome: 'Invalid',
            date: {
                $gt: beginTimestamp.toString(),
                $lt: endTimestamp.toString(),
            },
        }, {
            sortOnDate: false,
            includeResolutionWindow: false,
            includeWhitelist: false,
        });

        const dataPoints: Map<string, AnalyticsPoint> = beginTimestamp === 0 ? new Map() : createEmptyDataPoints(new Date(beginTimestamp), new Date(endTimestamp), metric);
        const dateFormat = getDateMetricFormat(metric);

        await requests.forEach((request) => {
            const pointKey = format(new Date(Number(request.date)), dateFormat);
            const dataPoint = dataPoints.get(pointKey);

            dataPoints.set(pointKey, {
                key: pointKey,
                data: [
                    new Big(dataPoint?.data[0] ?? 0).add(1).toString(),
                ],
            });
        });

        return Array.from(dataPoints.values());
    } catch (error) {
        console.error('[getInvalidRequestsAnalytics]', error);
        return [];
    }
}