import { gql } from 'apollo-server';

const typeDef = gql`
    type Claim {
        payout: String
        account_id: String
        data_request_id: String
        total_correct_bonded_staked: String
        total_incorrect_staked: String
        user_correct_stake: String
    }
`;

export default typeDef;
