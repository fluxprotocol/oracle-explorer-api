export interface DataRequestSource {
    end_point: string;
    source_path: string;
}

export interface DataRequest {
    id: string;
    sources: DataRequestSource[]
    settlement_time: string;
    outcomes: string[];
    requestor: string;
    initial_challenge_period: string;
    final_arbitrator_triggered: boolean;
    target_contract: string;
    date: string;
    block_height: string;
}