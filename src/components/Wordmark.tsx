/** Wordmark en texto, siguiendo el logo manuscrito "entre migas". */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-hand leading-none whitespace-nowrap ${className}`}>
      <span className="text-ink">entre</span>{' '}
      <span className="text-brand-clay dark:text-accent">migas</span>
    </span>
  );
}
