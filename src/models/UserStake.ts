import { Claim } from "./Claim";
import { DataRequest } from "./DataRequest";

export interface UserStake {
    id: string;
    data_request_id: string;
    round: number;
    outcome: string | { Answer: string };
    account_id: string;
    total_stake: string;

    data_request?: DataRequest;
    claim?: Claim;
}