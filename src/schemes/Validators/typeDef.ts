import { gql } from 'apollo-server';

const typeDef = gql`
    type ActiveValidatorItem {
        id: String
        account_id: String
        last_activity: String
    }

    type ActiveValidatorItemPaginationResult {
        items: [ActiveValidatorItem]
        total: Int
    }

    extend type Query {
        getActiveValidators(limit: Int, offset: Int): ActiveValidatorItemPaginationResult
    }
`;

export default typeDef;
