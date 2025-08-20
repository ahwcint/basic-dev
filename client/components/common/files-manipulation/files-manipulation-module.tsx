'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

import { useEffect, useRef, useState } from 'react';
import { TableFolder } from './table-folder';
import { Table } from '@tanstack/react-table';
import { FileArchive } from 'lucide-react';
import { BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

const gifUrlState = {
  sleep:
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwdjk0cjR2OHB5MGF1aXB1NjBjYzI3MXBoMWZwcTNlbXBsbXpjbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yFQ0ywscgobJK/giphy.gif',
  working:
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwdjk0cjR2OHB5MGF1aXB1NjBjYzI3MXBoMWZwcTNlbXBsbXpjbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lJNoBCvQYp7nq/giphy.gif',
  almost:
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dGVhdjRucGpzOWplMzlmZDMwMjdqbTBtbnJnZTY0a3lhY2pxeGQ2aCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YJ85eVpdZDy7e/giphy.gif',
};

export function FilesManipulationModule() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>('none');
  const [gifShown, setGifShown] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const tableRef = useRef<Table<File>>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);

    switch (value as keyof typeof TableFolder.selectObjectMap) {
      case 'name':
        tableRef.current?.setSorting([{ id: 'name', desc: false }]);
        break;
      case 'type':
        tableRef.current?.setSorting([{ id: 'type', desc: false }]);
        break;
      case 'size':
        tableRef.current?.setSorting([{ id: 'size', desc: false }]);
        break;
      case 'none':
        tableRef.current?.setSorting([]);
        break;
    }
  };

  const handleExportFiles = async () => {
    setIsExporting(true);
    const selectedFiles = tableRef.current?.getRowModel().rows.map((row) => row.original);
    if (!selectedFiles) return setIsExporting(false);
    controllerRef.current = new AbortController(); // create new abort controller when exporting files

    try {
      const writer = new ZipWriter(new BlobWriter('application/zip'), {
        signal: controllerRef.current.signal,
      });

      for (const index in selectedFiles) {
        const file = selectedFiles[index];
        setProgress(((1 + Number(index)) / selectedFiles.length) * 100);

        if (controllerRef.current.signal.aborted) continue; // skip if aborted
        await writer.add(`${file.type}/${file.name}`, file.stream(), {
          signal: controllerRef.current.signal,
        });
      }
      const blob = await writer.close();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sorted_files.zip';

      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for cat to rest

      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        console.error(err);
        toast.error('Export failed');
      } else {
        toast.success('Export aborted');
      }
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (progress >= 80) {
      setGifShown(gifUrlState.almost);
    } else if (progress >= 30) {
      setGifShown(gifUrlState.working);
    } else {
      setGifShown(gifUrlState.sleep);
    }
  }, [progress]);

  return (
    <div className="h-full overflow-hidden p-4 flex flex-col gap-2">
      <Button
        variant={'outline'}
        onClick={() => inputRef.current?.click()}
        className={`${files.length <= 0 ? 'animate-pulse' : ''}`}
      >
        <FileArchive />
        Browse folder
      </Button>
      <Input
        ref={inputRef}
        hidden={files.length <= 0}
        type="file"
        multiple
        placeholder="เลือกโฟลเดอร์"
        onChange={handleFolderSelect}
        {...({ webkitdirectory: 'true', directory: '' } as Record<string, string>)} // Enabled for directory selection
      />

      {files.length <= 0 ? (
        <p>กรุณาเลือกโฟลเดอร์ที่มีไฟล์</p>
      ) : (
        <>
          <div>
            <Select onValueChange={handleSortChange} value={selectedSort}>
              <SelectTrigger>
                Sort by:{' '}
                {TableFolder.selectObjectMap[
                  selectedSort as keyof typeof TableFolder.selectObjectMap
                ] ?? TableFolder.selectObjectMap.none}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">{TableFolder.selectObjectMap.name}</SelectItem>
                  <SelectItem value="type">{TableFolder.selectObjectMap.type}</SelectItem>
                  <SelectItem value="size">{TableFolder.selectObjectMap.size}</SelectItem>
                  <SelectItem value="none">{TableFolder.selectObjectMap.none}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <TableFolder files={files} tableRef={tableRef} />
          <div className="flex justify-end gap-2">
            <Button variant={'outline'} disabled>
              Preview is under development
            </Button>
            <Button variant={'default'} onClick={handleExportFiles} disabled={isExporting}>
              Export
            </Button>
          </div>
        </>
      )}

      {/* progression screen */}
      <Dialog open={isExporting}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Exporting files...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center w-full">
            <Image
              src={gifShown}
              width={100}
              height={100}
              alt={'loading'}
              unoptimized
              className="w-full max-w-[25rem]"
            />
          </div>
          <Progress value={progress} />
          <DialogFooter>
            <Button
              variant={'destructive'}
              onClick={() => {
                setIsExporting(true);
                controllerRef.current?.abort();
              }}
            >
              Cancel this progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
