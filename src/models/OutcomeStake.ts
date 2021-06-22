import { Outcome } from "./Outcome";

export interface OutcomeStake {
    id: string;
    data_request_id: string;
    round: number;
    outcome: Outcome;
    total_stake: string;
}