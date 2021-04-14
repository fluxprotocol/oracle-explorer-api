import { gql } from 'apollo-server';

const typeDef = gql`
    type Claim {
        payout: String
    }
`;

export default typeDef;
