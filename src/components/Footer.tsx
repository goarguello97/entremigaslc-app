import { ArrowUpRight, MapPin } from 'lucide-react';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, LOCATION } from '../config';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark className="text-4xl" />
        <div className="flex flex-col gap-2 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-6">
          <span className="flex items-center gap-1.5">
            <MapPin size={16} strokeWidth={2} />
            {LOCATION}
          </span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-ink underline-offset-4 hover:underline"
          >
            Instagram @{INSTAGRAM_HANDLE}
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </footer>
  );
}
