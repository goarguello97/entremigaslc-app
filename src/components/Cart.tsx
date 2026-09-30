import { MessageCircle, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MAX_HALF_DOZENS } from '../config';
import { useCart } from '../context/CartContext';
import { CATEGORY_TINT } from '../data/products';
import { formatPrice, formatQuantityShort, sandwichCount } from '../utils/format';
import { CHECKOUT_FORM_ID, CheckoutForm } from './CheckoutForm';
import { QuantityStepper } from './QuantityStepper';
import { SandwichArt } from './SandwichArt';

export function Cart() {
  const { isOpen, closeCart, lines, total, setQuantity, removeItem, clearCart } = useCart();
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const totalSandwiches = lines.reduce((n, l) => n + sandwichCount(l.halfDozens), 0);
  const isEmpty = lines.length === 0;

  const startNewOrder = () => {
    clearCart();
    setSentUrl(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div
        className="absolute inset-0 animate-fade-in bg-[#3a1f12]/45 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] animate-sheet-up flex-col rounded-t-3xl bg-paper shadow-[0_-20px_50px_-20px_rgba(58,31,18,0.4)] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[440px] md:animate-sheet-left md:rounded-none md:rounded-l-3xl">
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-line md:hidden" aria-hidden="true" />

        <header className="flex items-start justify-between px-5 pt-3 pb-4 md:pt-7">
          <div>
            <h2 id="cart-title" className="text-2xl font-semibold tracking-tight">
              Tu pedido
            </h2>
            {!isEmpty && !sentUrl && (
              <p className="mt-0.5 text-sm text-ink-soft">
                {totalSandwiches} sándwiches, {lines.length}{' '}
                {lines.length === 1 ? 'variedad' : 'variedades'}
              </p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Cerrar pedido"
            className="grid size-10 place-items-center rounded-full bg-surface ring-1 ring-line transition hover:ring-ink/30 active:scale-90"
          >
            <X size={19} strokeWidth={2} />
          </button>
        </header>

        {sentUrl ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-10 text-center">
            <SandwichArt waving layers={['#C5583B', '#8E9458']} className="w-40" />
            <div>
              <p className="font-hand text-4xl">¡Pedido listo!</p>
              <p className="mt-2 max-w-[30ch] text-ink-soft">
                Enviá el mensaje en WhatsApp. Revisamos la disponibilidad y te respondemos para
                confirmarlo.
              </p>
            </div>
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-accent underline underline-offset-4"
            >
              ¿No se abrió WhatsApp? Tocá acá
            </a>
            <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
              <button
                type="button"
                onClick={startNewOrder}
                className="h-12 rounded-full bg-ink font-semibold text-paper transition hover:opacity-90 active:scale-[0.98]"
              >
                Empezar otro pedido
              </button>
              <button
                type="button"
                onClick={() => setSentUrl(null)}
                className="h-12 rounded-full bg-surface font-semibold ring-1 ring-line transition hover:ring-ink/30 active:scale-[0.98]"
              >
                Volver al pedido
              </button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-14 text-center">
            <SandwichArt layers={['#E59383', '#F1C23E']} className="w-32 opacity-90" />
            <p className="mt-2 text-lg font-semibold">Tu pedido está vacío</p>
            <p className="max-w-[28ch] text-ink-soft">
              Elegí tus variedades en el menú y aparecen acá.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 h-12 rounded-full bg-ink px-6 font-semibold text-paper transition hover:opacity-90 active:scale-[0.98]"
            >
              Ir al menú
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
              <ul className="flex flex-col gap-2">
                {lines.map(({ product, halfDozens, subtotal }) => (
                  <li key={product.id} className="flex gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
                    <div
                      className="grid size-14 shrink-0 place-items-center rounded-xl"
                      style={{ backgroundColor: CATEGORY_TINT[product.category] }}
                    >
                      <SandwichArt layers={product.layers} className="w-12" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="leading-tight font-semibold">{product.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          aria-label={`Eliminar ${product.name}`}
                          className="-m-1.5 grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-paper-2 hover:text-danger"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <QuantityStepper
                          size="sm"
                          className="w-40"
                          value={halfDozens}
                          onChange={(v) => setQuantity(product.id, v)}
                          max={MAX_HALF_DOZENS}
                          label={formatQuantityShort(halfDozens)}
                          itemName={product.name}
                        />
                        <p className="font-semibold tabular-nums">{formatPrice(subtotal)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 mb-4 text-lg font-semibold">Tus datos</h3>
              <CheckoutForm onSubmitted={setSentUrl} />
            </div>

            <footer className="border-t border-line bg-paper px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:rounded-bl-3xl">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-ink-soft">Total</span>
                <span className="text-2xl font-bold tabular-nums">{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                form={CHECKOUT_FORM_ID}
                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-accent text-base font-semibold text-accent-ink transition hover:brightness-110 active:scale-[0.98]"
              >
                <MessageCircle size={20} strokeWidth={2} />
                Enviar por WhatsApp
              </button>
              <p className="mt-2.5 text-center text-xs text-ink-soft">
                Sujeto a disponibilidad. Te confirmamos por WhatsApp.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
