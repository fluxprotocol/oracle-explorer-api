import { gql } from 'apollo-server';

const typeDef = gql`
    type WhitelistItem {
        id: String
        interface_name: String
        account_id: String
        custom_fee: String
        code_base_url: String
        active: Boolean
        date: String
        block_height: String
    }

    type WhitelistPaginationResult {
        items: [WhitelistItem]
        total: Int
    }

    extend type Query {
        getWhitelistItem(id: String!): WhitelistItem
        getWhitelistItems(limit: Int, offset: Int): WhitelistPaginationResult
    }
`;

export default typeDef;
