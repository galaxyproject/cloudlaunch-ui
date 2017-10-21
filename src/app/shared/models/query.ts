export interface QueryResult<ModelType> {
    results: ModelType[];
    count: number;
    next: string;
    previous: string;
}
