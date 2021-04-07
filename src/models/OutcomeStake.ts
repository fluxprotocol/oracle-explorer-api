export interface OutcomeStake {
    id: string;
    data_request_id: string;
    round: number;
    outcome: string | { Answer: string };
    total_stake: string;
}