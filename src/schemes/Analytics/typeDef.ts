import { gql } from 'apollo-server';

const typeDef = gql`
    enum DateMetric {
        minute
        hour
        day
        week
        month
        year
    }

    type AnalyticsPoint {
        key: String
        data: [String]
    }

    extend type Query {
        getAccountAnalytics(accountId: String!, beginTimestamp: String!, endTimestamp: String, dateMetric: DateMetric): [AnalyticsPoint]
        getInvalidRequestsAnalytics(accountId: String!, beginTimestamp: String!, endTimestamp: String, dateMetric: DateMetric): [AnalyticsPoint]
    }
`;

export default typeDef;
