import { CardConcertInformation } from "../cards/CardConcertInformation";
import { useListConcert } from "@/lib/hooks/concert/useListConcert";
import { useState } from "react";
import {
  cancelReserveConcertService,
  reserveConcertService,
  softDeleteConcertService,
} from "@/services/concert.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFallback } from "@/lib/hooks/useFallback";
import { FileNotFound } from "../FileNotFound";

export function ConcertInformation({
  isViewMode = false,
}: {
  isViewMode?: boolean;
}) {
  const [query] = useState({ page: 1, pageSize: 20 });

  const queryClient = useQueryClient();
  const onMutateSuccess = (msg: string) => {
    toast.success(msg);
    queryClient.invalidateQueries({ queryKey: ["list-concert"] });
  };

  const {
    data: concertList,
    isLoading,
    error,
    isError,
  } = useListConcert({
    page: query.page,
    pageSize: query.pageSize,
  });

  const { mutate: deleteConcertApi } = useMutation({
    mutationFn: softDeleteConcertService,
    mutationKey: ["delete-concert"],
    onSuccess: (res) => {
      onMutateSuccess(res.message);
    },
  });

  const { mutateAsync: reserveConcertApi } = useMutation({
    mutationFn: reserveConcertService,
    mutationKey: ["reserve-concert"],
    onSuccess: (res) => {
      onMutateSuccess(res.message);
    },
  });

  const { mutateAsync: cancelReserveConcertApi } = useMutation({
    mutationFn: cancelReserveConcertService,
    mutationKey: ["cancel-concert"],
    onSuccess: (res) => {
      onMutateSuccess(res.message);
    },
  });

  const { isFallback, fallback } = useFallback({ isLoading, isError, error });
  if (isFallback) return fallback;

  if (!concertList) return null;
  if (!concertList.length) return <FileNotFound />;

  if (isViewMode)
    return (
      <>
        {concertList.map((concert) => (
          <CardConcertInformation
            data={concert}
            key={concert.id}
            isViewMode
            onReserve={reserveConcertApi}
            onCancel={cancelReserveConcertApi}
          />
        ))}
      </>
    );

  return (
    <>
      {concertList.map((concert) => (
        <CardConcertInformation
          data={concert}
          key={concert.id}
          onDelete={deleteConcertApi}
        />
      ))}
    </>
  );
}
