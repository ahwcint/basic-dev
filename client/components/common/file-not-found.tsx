import { FileIcon } from 'lucide-react';

export function FileNotFound() {
  return (
    <span className="text-gray-300 text-center p-10">
      <span>
        <FileIcon className="inline" />
      </span>
      <p>Nothing here yet.</p>
    </span>
  );
}
