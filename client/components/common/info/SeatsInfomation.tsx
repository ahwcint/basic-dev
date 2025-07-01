import { AwardIcon, CircleXIcon, UserIcon } from "lucide-react";
import { CardBanner } from "@/components/common/cards/CardBanner";
import { UserRole } from "@/services/types/user.type";
import { RoleGuard } from "@/lib/guard/RoleGuard";
import { getInformationSeatsService } from "@/services/concert.service";
import { useQuery } from "@tanstack/react-query";
import { useFallback } from "@/lib/hooks/useFallback";

function SeatsInformation() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["seats-information"],
    queryFn: getInformationSeatsService,
    select: (res) => res.data,
    placeholderData: (data) => data,
    refetchInterval: 5000,
  });

  const { fallback, isFallback } = useFallback({ isLoading, isError, error });
  if (isFallback) return fallback;

  if (!data) return null;
  return (
    <ul className="flex gap-5 *:grow">
      <li>
        <CardBanner
          headerIcon={<UserIcon className="inline" size={"2rem"} />}
          label="Total of seats"
          value={data.totalSeats}
          color="blue"
        />
      </li>
      <li>
        <CardBanner
          headerIcon={<AwardIcon className="inline" size={"2rem"} />}
          label="Reserve"
          value={data.reserve}
          color="green"
        />
      </li>
      <li>
        <CardBanner
          headerIcon={<CircleXIcon className="inline" size={"2rem"} />}
          label="Cancel"
          value={data.cancel}
          color="red"
        />
      </li>
    </ul>
  );
}

/**
 * @access ADMIN
 */
export function SeatsInformationWrapper() {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <SeatsInformation />
    </RoleGuard>
  );
}
