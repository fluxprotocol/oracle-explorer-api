import { gql } from 'apollo-server';

const typeDef = gql`
    type DataRequestSource {
        end_point: String
        source_path: String
    }

    type DataRequest {
        id: String
        sources: [DataRequestSource]
        description: String
        settlement_time: String
        outcomes: [String]
        requestor: String
        data_type: String
        finalized_outcome: String
        initial_challenge_period: String
        final_arbitrator_triggered: Boolean
        target_contract: String
        date: String
        block_height: String
        global_config_id: String
        tags: [String]

        resolution_windows: [ResolutionWindow]
        config: OracleConfig
        # TODO: Add connections
    }

    type DataRequestPaginationResult {
        items: [DataRequest]
        total: Int
    }

    type DataRequestCursorResult {
        items: [DataRequest]
        next: String
    }

    extend type Query {
        getDataRequest(id: String!): DataRequest
        getDataRequests(limit: Int, offset: Int, onlyArbitratorRequests: Boolean, tags: [String], requestor: String): DataRequestPaginationResult
        getDataRequestsAsCursor(cursor: String, limit: Int): DataRequestCursorResult
    }
`;

export default typeDef;
