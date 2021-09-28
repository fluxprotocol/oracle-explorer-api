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
