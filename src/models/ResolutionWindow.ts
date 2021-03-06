import { Outcome } from "./Outcome";
import { OutcomeStake } from "./OutcomeStake";
import { UserStake } from "./UserStake";

export interface ResolutionWindow {
    id: string;
    dr_id: string;
    round: number;
    end_time: string;
    bond_size: string;
    date: string;
    block_height: string;
    
    bonded_outcome: null | Outcome;
    outcome_stakes?: OutcomeStake[];
    user_stakes?: UserStake[];
}
