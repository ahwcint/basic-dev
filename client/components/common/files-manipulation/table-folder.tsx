'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getCoreRowModel,
  getSortedRowModel,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect } from 'react';

export function TableFolder({
  files,
  tableRef,
}: {
  files: File[];
  tableRef: React.RefObject<TableType<File> | null>;
}) {
  const table = useReactTable({
    data: files,
    columns: [
      {
        id: 'name',
        header: 'ชื่อไฟล์',
        accessorKey: 'name',
        accessorFn: (row) => row.name,
      },
      {
        id: 'type',
        header: 'ประเภท',
        accessorKey: 'type',
        accessorFn: (row) => row.type,
      },
      {
        id: 'size',
        header: 'ขนาด',
        accessorKey: 'size',
        accessorFn: (row) => row.size,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (!tableRef.current) tableRef.current = table;
  }, [table, tableRef]);

  return (
    <>
      <h2>รายชื่อไฟล์ในโฟลเดอร์ :</h2>
      <Table className="bg-muted/50 rounded-2xl overflow-hidden">
        <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-lg">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{header.column.columnDef.header?.toString()}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.getValue('name')}</TableCell>
              <TableCell>{file.getValue('type')}</TableCell>
              <TableCell>{file.getValue('size')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

TableFolder.selectObjectMap = {
  name: 'ชื่อ',
  type: 'ประเภท',
  size: 'ขนาด',
  none: 'ไม่เรียงลำดับ',
} as const;
