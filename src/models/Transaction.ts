export interface Transaction {
    account_id: string;
    input: string;
    output: string;
    data_request_id: string;
    round?: number;
    date: string;
    block_height: string;
    extra_info?: string;
    cap_creation_date: Date;
    type: 'Stake' | 'Unstake';
}