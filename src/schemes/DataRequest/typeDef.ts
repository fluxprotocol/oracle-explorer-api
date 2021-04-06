import { gql } from 'apollo-server';

const typeDef = gql`
    type DataRequestSource {
        end_point: String
        source_path: String
    }

    type DataRequest {
        id: String
        sources: [DataRequestSource]
        settlement_time: String
        outcomes: [String]
        requestor: String
        # finalized_outcome: IETS
        initial_challenge_period: String
        final_arbitrator_triggered: Boolean
        target_contract: String
        date: String
        block_height: String
        global_config_id: String

        resolution_windows: [ResolutionWindow]
        config: OracleConfig
        # TODO: Add connections
    }

    type DataRequestPaginationResult {
        items: [DataRequest]
        total: Int
    }

    extend type Query {
        getDataRequest(id: String!): DataRequest
        getDataRequests(limit: Int, offset: Int): DataRequestPaginationResult
    }
`;

export default typeDef;
