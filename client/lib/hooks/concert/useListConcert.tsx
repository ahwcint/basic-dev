import { ConcertType } from "@/services/types/concert.type";
import { listConcertService } from "@/services/concert.service";
import { useQuery } from "@tanstack/react-query";
import { BadResponse, CallApiResponse } from "@/lib/api/type";

type PaginationParams = {
  page: number;
  pageSize: number;
};

export function useListConcert({ page, pageSize }: PaginationParams) {
  const query = useQuery<
    CallApiResponse<ConcertType[]>,
    BadResponse,
    ConcertType[]
  >({
    queryKey: ["list-concert", page, pageSize],
    queryFn: () => listConcertService({ page, pageSize }),
    placeholderData: (data) => data,
    select: (data) => data.data,
  });
  return query;
}
