import { OracleConfig } from "./OracleConfig";
import { Outcome } from "./Outcome";
import { ResolutionWindow } from "./ResolutionWindow";
import { WhitelistItem } from "./WhitelistItem";

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
    finalized_outcome: null | Outcome;
    target_contract: string;
    date: string;
    block_height: string;
    global_config_id: string;
    tags: null | string[];
    data_type: 'String' | { Number: string };

    config: OracleConfig;
    resolution_windows?: ResolutionWindow[];
    whitelist_item?: WhitelistItem;
}