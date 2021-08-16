import { gql } from 'apollo-server';

const typeDef = gql`
    type DataRequestSource {
        end_point: String
        source_path: String
    }

    type DataRequest {
        id: String
        claim(accountId: String): Claim
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
        fee: String
        paid_fee: String

        total_incorrect_staked: String
        total_correct_bonded_staked: String
        
        account_stakes(accountId: String): [UserStake]
        resolution_windows: [ResolutionWindow]
        config: OracleConfig
        whitelist_item: WhitelistItem
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
