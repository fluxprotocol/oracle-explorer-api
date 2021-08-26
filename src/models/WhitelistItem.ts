export interface WhitelistItem {
    id: string;
    interface_name: string;
    account_id: string;
    custom_fee: string | { Fixed: string } | { Multiplier: number };
    code_base_url: string;
    active: boolean;
    date: string;
    block_height: string;
}