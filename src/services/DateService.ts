import { addDays, addHours, addMinutes, addMonths, addWeeks, addYears } from "date-fns";
import format from "date-fns/format";
import { AnalyticsPoint } from "../models/AccountAnalytics";

export enum DateMetric {
    minute = "minute",
    hour = "hour",
    day = "day",
    week = "week",
    month = "month",
    year = "year",
}

/**
 * Gives back a date-fns compatible format to use as key for grouping dates together
 *
 * @export
 * @param {DatePart} datePart
 * @return {string}
 */
export function getDateMetricFormat(datePart: DateMetric): string {
    switch (datePart) {
        case DateMetric.minute:
            return "dd-MM-yyyy/HH:mm";
        case DateMetric.hour:
            return "dd-MM-yyyy/HH";
        case DateMetric.day:
            return "dd-MM-yyyy";
        case DateMetric.week:
            return "II/MM-yyyy";
        case DateMetric.month:
            return "MM-yyyy";
        case DateMetric.year:
            return "yyyy";
    }
}

function addOneToDate(date: Date, metric: DateMetric): Date {
    switch (metric) {
        case DateMetric.minute:
            return addMinutes(date, 1);
        case DateMetric.hour:
            return addHours(date, 1);
        case DateMetric.day:
            return addDays(date, 1);
        case DateMetric.week:
            return addWeeks(date, 1);
        case DateMetric.month:
            return addMonths(date, 1);
        case DateMetric.year:
            return addYears(date, 1);
    }
}

export function createEmptyDataPoints(beginDate: Date, endDate: Date, metric: DateMetric, dataLength = 1) {
    const dataPoints = new Map<string, AnalyticsPoint>();
    const dateFormat = getDateMetricFormat(metric);
    let previousDateKey = format(beginDate, dateFormat);

    dataPoints.set(previousDateKey, {
        key: previousDateKey,
        data: new Array(dataLength).fill('0'),
    });

    let currentDate = addOneToDate(beginDate, metric);
    
    while(previousDateKey !== format(currentDate, dateFormat)) {
        previousDateKey = format(currentDate, dateFormat);
        currentDate = addOneToDate(currentDate, metric);

        dataPoints.set(previousDateKey, {
            key: previousDateKey,
            data: new Array(dataLength).fill('0'),
        });

        if (endDate.getTime() < currentDate.getTime()) {
            break;
        }
    }

    return dataPoints;
}