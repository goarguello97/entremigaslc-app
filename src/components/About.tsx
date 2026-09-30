import { Heart } from 'lucide-react';
import { SandwichArt } from './SandwichArt';

export function About() {
  return (
    <section
      id="nosotros"
      aria-label="Quiénes somos"
      className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-28"
    >
      <div className="relative mx-auto grid aspect-square w-full max-w-[300px] place-items-center md:max-w-[360px]">
        <Heart
          aria-hidden="true"
          className="absolute inset-0 size-full text-accent-soft"
          fill="currentColor"
          strokeWidth={0}
        />
        <SandwichArt layers={['#E59383', '#F1C23E']} className="relative mt-6 w-[62%]" />
      </div>

      <div>
        <p className="font-hand text-[42px] leading-[1.1] text-ink md:text-6xl">
          Los mejores momentos siempre tienen algo rico para compartir.
        </p>
        <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-ink-soft">
          Somos Vale y Martín. Creamos Entre Migas por el sueño de tener algo propio y casero,
          hecho para acompañar los buenos momentos.
        </p>
        <p className="mt-5 font-hand text-3xl text-accent">Vale &amp; Martín</p>
      </div>
    </section>
  );
}
