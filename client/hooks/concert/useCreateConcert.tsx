'use client';

import { createConcertService } from '@/services/concert.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateConcert({
  onSuccess,
}: {
  onSuccess: (data: Awaited<ReturnType<typeof createConcertService>>) => void;
}) {
  const mutation = useMutation({
    mutationKey: ['create-concert'],
    mutationFn: createConcertService,
    onSuccess,
  });

  return mutation;
}
