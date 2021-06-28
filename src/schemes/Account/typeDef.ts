import { gql } from 'apollo-server';

const typeDef = gql`
    type Account {
        active_staking: String
        total_staked: String
        total_claimed: String
        whitelist_item: WhitelistItem
    }

    extend type Query {
        getAccountInfo(accountId: String!): Account
    }
`;

export default typeDef;
