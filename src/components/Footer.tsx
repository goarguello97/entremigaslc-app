import { ArrowUpRight, MapPin } from 'lucide-react';
import { AUTHOR } from '../config';
import { useCatalog } from '../context/CatalogContext';
import { Wordmark } from './Wordmark';

export function Footer() {
  const { settings } = useCatalog();

  return (
    <footer className="bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark className="text-4xl" />
        <div className="flex flex-col gap-2 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-6">
          {settings.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={16} strokeWidth={2} />
              {settings.location}
            </span>
          )}
          {settings.instagram && (
            <a
              href={`https://www.instagram.com/${settings.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-ink underline-offset-4 hover:underline"
            >
              Instagram @{settings.instagram}
              <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          )}
        </div>
      </div>

      {/* Crédito del autor. pb extra en mobile para que no lo tape la barra flotante del pedido. */}
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 md:pb-8">
        <p className="border-t border-line pt-5 text-xs text-ink-soft">
          Diseño y desarrollo:{' '}
          <a
            href={AUTHOR.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-ink underline-offset-4 hover:underline"
          >
            {AUTHOR.name}
            <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">(LinkedIn, se abre en una pestaña nueva)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
