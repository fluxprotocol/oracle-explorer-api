import { gql } from 'apollo-server';

const typeDef = gql`
    type Account {
        active_staking: String
        total_staked: String
        total_claimed: String
        total_disputes: String
        total_amount_slashed: String
        times_slashed: String
        whitelist_item: WhitelistItem
        has_stakes: Boolean
        has_requests: Boolean
    }

    extend type Query {
        getAccountInfo(accountId: String!): Account
    }
`;

export default typeDef;
