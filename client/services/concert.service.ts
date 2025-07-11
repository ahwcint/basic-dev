import { callApi } from '@/lib/api/call-api';
import { ConcertAuditLog, ConcertType, SeatsInformation } from '@/services/types/concert.type';

const MODULE_NAME = 'concert';

export const listConcertService = async ({
  page = 1,
  pageSize = 20,
}: {
  page: number;
  pageSize: number;
}) => {
  return await callApi<ConcertType[]>('GET', `/${MODULE_NAME}`, {
    params: {
      page,
      pageSize,
    },
  });
};

type CreateConcertDto = Pick<ConcertType, 'totalSeats' | 'description' | 'name'>;

export const createConcertService = async (data: CreateConcertDto) => {
  return await callApi<ConcertType>('POST', `/${MODULE_NAME}`, { body: data });
};

export const softDeleteConcertService = async (concertId: string) => {
  return await callApi<ConcertType>('PATCH', `/${MODULE_NAME}/${concertId}`);
};

export const reserveConcertService = async (concertId: string) => {
  return await callApi<ConcertAuditLog>('POST', `/${MODULE_NAME}/reserve`, {
    body: { concertId },
  });
};

export const cancelReserveConcertService = async (concertId: string) => {
  return await callApi<ConcertAuditLog>('POST', `/${MODULE_NAME}/cancel`, {
    body: { concertId },
  });
};

export const getInformationSeatsService = async () => {
  return await callApi<SeatsInformation>('GET', `/${MODULE_NAME}/seats/information`);
};

export const listHistoryConcertReservation = async () => {
  return await callApi<ConcertAuditLog[]>('GET', `/${MODULE_NAME}/seats/audit-log`);
};
