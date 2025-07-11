import { Button } from '@/components/ui/custom-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConcertAuditLogAction, ConcertType } from '@/services/types/concert.type';
import { TrashIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

type CardConcertInformationProp = {
  data: ConcertType | undefined;
  onReserve?: (concertId: string) => Promise<unknown>;
  onCancel?: (concertId: string) => Promise<unknown>;
  onDelete?: (concertId: string) => void;
  isViewMode?: boolean;
};

export function CardConcertInformation({
  onDelete,
  onReserve,
  onCancel,
  isViewMode = false,
  data,
}: CardConcertInformationProp) {
  if (!data) return null;
  const action = data.auditLogConcerts[0]?.action;
  const isReserved = action === ConcertAuditLogAction.RESERVE;
  return (
    <Card className="p-5 gap-2">
      <CardHeader className="px-0 text-xl">
        <CardTitle>{data.name}</CardTitle>
      </CardHeader>
      <Separator className="my-0" />
      <CardContent className="px-0">{data.description}</CardContent>
      <CardFooter className="justify-between px-0">
        <Button variant={'ghost'} startIcon={<UserIcon />} className="px-2">
          {data.totalSeats ?? '-'}
        </Button>

        {isViewMode && (
          <ButtonViewMode
            concertId={data.id}
            isReserved={isReserved}
            onReserve={onReserve}
            onCancel={onCancel}
          />
        )}

        {!isViewMode && (
          <Button
            variant={'destructive'}
            startIcon={<TrashIcon />}
            onClick={() => onDelete?.(data.id)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

const ButtonViewMode = ({
  onReserve,
  concertId,
  onCancel,
  isReserved,
}: {
  concertId: string;
  isReserved: boolean;
} & Pick<CardConcertInformationProp, 'onReserve' | 'onCancel'>) => {
  const [loading, setLoading] = useState(false); // instance update

  const handleClick = (fn?: Promise<unknown>) => {
    if (!fn) return;
    setLoading(true);
    fn.finally(() => setLoading(false));
  };
  if (isReserved)
    return (
      <Button
        variant={'destructive'}
        onClick={() => {
          handleClick(onCancel?.(concertId));
        }}
        loading={loading}
      >
        Cancel
      </Button>
    );
  return (
    <Button
      variant={'action'}
      onClick={() => {
        handleClick(onReserve?.(concertId));
      }}
      loading={loading}
    >
      Reserve
    </Button>
  );
};
