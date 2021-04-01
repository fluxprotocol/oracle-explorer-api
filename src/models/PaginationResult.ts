export interface PaginationResult<T> {
    items: T[];
    total: number;
}

export interface PaginationFilters {
    limit: number;
    offset: number;
}
