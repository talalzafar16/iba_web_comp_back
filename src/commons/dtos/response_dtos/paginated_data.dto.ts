//@ts-nocheck

export class PaginatedResponse<TData> {
  total: number;
  results: TData[];
}
