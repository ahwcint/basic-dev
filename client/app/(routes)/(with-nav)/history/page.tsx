"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleGuard } from "@/lib/guard/RoleGuard";
import { useFallback } from "@/lib/hooks/useFallback";
import { listHistoryConcertReservation } from "@/services/concert.service";
import { UserRole } from "@/services/types/user.type";
import { useQuery } from "@tanstack/react-query";

export default function HistoryPageWrapper() {
  return (
    <>
      <RoleGuard allowedRoles={[UserRole.ADMIN]} redirectTo={"home"}>
        <HistoryPage />
      </RoleGuard>
    </>
  );
}

function HistoryPage() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["list-audit-log-concert"],
    queryFn: listHistoryConcertReservation,
  });

  const auditLogConcert = data?.data || [];
  const { fallback, isFallback } = useFallback({
    error,
    isError,
    isLoading,
    variant: "single",
  });
  if (isFallback) return fallback;

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date time</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Concert name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogConcert.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.createdAt}</TableCell>
              <TableCell>{i.user.username}</TableCell>
              <TableCell>{i.concert.name}</TableCell>
              <TableCell>{i.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
