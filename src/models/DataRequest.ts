import { OracleConfig } from "./OracleConfig";
import { ResolutionWindow } from "./ResolutionWindow";

export interface DataRequestSource {
    end_point: string;
    source_path: string;
}

export interface DataRequest {
    id: string;
    sources: DataRequestSource[]
    description: string;
    settlement_time: string;
    outcomes: string[];
    requestor: string;
    initial_challenge_period: string;
    final_arbitrator_triggered: boolean;
    finalized_outcome: null | string | { Answer: string };
    target_contract: string;
    date: string;
    block_height: string;
    global_config_id: string;

    config: OracleConfig;
    resolution_windows?: ResolutionWindow[];
}