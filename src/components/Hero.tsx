import type { CSSProperties } from 'react';
import { ArrowDown } from 'lucide-react';
import { SandwichArt } from './SandwichArt';

export function Hero() {
  return (
    <section className="px-4 pt-2 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-center overflow-hidden rounded-3xl bg-mustard text-on-mustard md:grid-cols-[1.25fr_1fr]">
        <div className="px-6 pt-9 sm:px-10 md:py-16 lg:px-14 lg:py-20">
          <h1
            className="rise text-[44px] leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl md:text-5xl lg:text-[64px]"
            style={{ '--i': 0 } as CSSProperties}
          >
            Miga casera, para compartir.
          </h1>
          <p
            className="rise mt-5 max-w-[40ch] text-lg leading-snug"
            style={{ '--i': 1 } as CSSProperties}
          >
            Sándwiches de miga triples y bien rellenos, por docena o media. Armá tu pedido y lo
            confirmamos por WhatsApp.
          </p>
          <a
            href="#menu"
            className="rise mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-on-mustard px-6 font-semibold text-mustard transition hover:opacity-90 active:scale-[0.97]"
            style={{ '--i': 2 } as CSSProperties}
          >
            Ver el menú
            <ArrowDown size={18} strokeWidth={2} />
          </a>
        </div>

        <div
          className="rise flex justify-center px-6 pt-4 pb-2 md:justify-start md:p-10"
          style={{ '--i': 2 } as CSSProperties}
        >
          <SandwichArt
            waving
            layers={['#C5583B', '#8E9458']}
            className="w-64 sm:w-80 md:w-full md:max-w-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
