import { gql } from 'apollo-server';

const typeDef = gql`
    type OracleConfig {
        id: String
        gov: String
        final_arbitrator: String
        stake_token: String
        bond_token: String
        validity_bond: String
        max_outcomes: Int
        default_challenge_window_duration: String
        min_initial_challenge_window_duration: String
        final_arbitrator_invoke_amount: String
        resolution_fee_percentage: Int
        date: String
        block_height: String
    }

    type OracleConfigPaginationResult {
        items: [OracleConfig]
        total: Int
    }

    extend type Query {
        getOracleConfig(id: String!): OracleConfig
        getOracleConfigs(limit: Int, offset: Int): OracleConfigPaginationResult
    }
`;

export default typeDef;