export interface OracleConfig {
    id: string;
    gov: string;
    final_arbitrator: string;
    stake_token: string;
    bond_token: string;
    validity_bond: string;
    max_outcomes: number;
    default_challenge_window_duration: string;
    min_initial_challenge_window_duration: string;
    final_arbitrator_invoke_amount: string;
    resolution_fee_percentage: number;
    date: string;
    block_height: string;
    fee: {
        flux_market_cap: string;
        total_value_staked: string;
        resolution_fee_percentage: number;
    }
}