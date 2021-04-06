import { gql } from 'apollo-server';

const typeDef = gql`
    type UserStake {
        id: String
        data_request_id: String
        round: Int
        outcome: String
        account_id: String
        total_stake: String
    }
`;

export default typeDef;
