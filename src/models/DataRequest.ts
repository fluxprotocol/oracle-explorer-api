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
    requestor: {
        interface_name: string;
        account_id: string;
        stake_multiplier: string | null;
        code_base_url: string | null;
    };
    requestor_account_id: string;
    initial_challenge_period: string;
    final_arbitrator_triggered: boolean;
    finalized_outcome: null | Outcome;
    date: string;
    block_height: string;
    global_config_id: string;
    tags: null | string[];
    data_type: 'String' | { Number: string };
    paid_fee: string | null;

    config: OracleConfig;
    resolution_windows?: ResolutionWindow[];
    whitelist_item?: WhitelistItem;
}