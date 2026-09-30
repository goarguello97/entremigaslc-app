import { Banknote, Landmark, Store, Truck, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { WHATSAPP_NUMBER } from '../config';
import { useCart } from '../context/CartContext';
import type { CustomerInfo, DeliveryMethod, PaymentMethod } from '../types';
import { buildOrderUrl } from '../utils/whatsapp';

export const CHECKOUT_FORM_ID = 'checkout-form';
const STORAGE_KEY = 'miga-customer-v1';

const EMPTY_CUSTOMER: CustomerInfo = {
  name: '',
  delivery: 'envio',
  address: '',
  payment: 'efectivo',
  notes: '',
};

function loadCustomer(): CustomerInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Las notas son de cada pedido; no se recuerdan.
    return raw ? { ...EMPTY_CUSTOMER, ...JSON.parse(raw), notes: '' } : EMPTY_CUSTOMER;
  } catch {
    return EMPTY_CUSTOMER;
  }
}

type Errors = Partial<Record<'name' | 'address', string>>;

function validate(c: CustomerInfo): Errors {
  const errors: Errors = {};
  if (c.name.trim().length < 2) errors.name = 'Ingresá tu nombre.';
  if (c.delivery === 'envio' && c.address.trim().length < 5)
    errors.address = 'Ingresá la dirección de entrega.';
  return errors;
}

interface OptionCardProps<T extends string> {
  name: string;
  value: T;
  current: T;
  onSelect: (value: T) => void;
  icon: LucideIcon;
  title: string;
  hint: string;
}

function OptionCard<T extends string>({
  name,
  value,
  current,
  onSelect,
  icon: Icon,
  title,
  hint,
}: OptionCardProps<T>) {
  const checked = value === current;
  return (
    <label
      className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
        checked ? 'border-ink bg-ink text-paper' : 'border-line bg-surface hover:border-ink/30'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <Icon size={20} strokeWidth={2} className="shrink-0" />
      <span className="min-w-0">
        <span className="block text-sm leading-tight font-semibold">{title}</span>
        <span className={`block text-xs ${checked ? 'text-paper/75' : 'text-ink-soft'}`}>{hint}</span>
      </span>
    </label>
  );
}

const inputClass =
  'w-full rounded-2xl border bg-surface px-4 py-3 text-base placeholder:text-ink-soft transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20';

interface CheckoutFormProps {
  onSubmitted: (whatsappUrl: string) => void;
}

export function CheckoutForm({ onSubmitted }: CheckoutFormProps) {
  const { lines, total } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(loadCustomer);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    try {
      const { notes: _notes, ...rest } = customer;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      // Ignorar: recordar los datos es solo una comodidad.
    }
  }, [customer]);

  const update = <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => {
    const next = { ...customer, [key]: value };
    setCustomer(next);
    if (touched) setErrors(validate(next));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    const found = validate(customer);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = e.currentTarget.querySelector<HTMLInputElement>(
        `[name="${found.name ? 'name' : 'address'}"]`,
      );
      firstInvalid?.focus();
      return;
    }
    const url = buildOrderUrl(WHATSAPP_NUMBER, lines, customer, total);
    window.open(url, '_blank', 'noopener,noreferrer');
    onSubmitted(url);
  };

  return (
    <form id={CHECKOUT_FORM_ID} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
          Nombre y apellido
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Juan Pérez"
          value={customer.name}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`${inputClass} ${errors.name ? 'border-danger' : 'border-line'}`}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-sm text-danger">
            {errors.name}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Entrega</legend>
        <div className="grid grid-cols-2 gap-2">
          <OptionCard<DeliveryMethod>
            name="delivery"
            value="envio"
            current={customer.delivery}
            onSelect={(v) => update('delivery', v)}
            icon={Truck}
            title="Envío"
            hint="A domicilio"
          />
          <OptionCard<DeliveryMethod>
            name="delivery"
            value="retiro"
            current={customer.delivery}
            onSelect={(v) => update('delivery', v)}
            icon={Store}
            title="Retiro"
            hint="Por el local"
          />
        </div>
      </fieldset>

      {customer.delivery === 'envio' && (
        <div className="animate-fade-in">
          <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">
            Dirección de entrega
          </label>
          <input
            id="address"
            name="address"
            autoComplete="street-address"
            placeholder="Calle, número, piso/depto"
            value={customer.address}
            onChange={(e) => update('address', e.target.value)}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : 'address-hint'}
            className={`${inputClass} ${errors.address ? 'border-danger' : 'border-line'}`}
          />
          {errors.address ? (
            <p id="address-error" className="mt-1.5 text-sm text-danger">
              {errors.address}
            </p>
          ) : (
            <p id="address-hint" className="mt-1.5 text-xs text-ink-soft">
              El costo de envío se coordina por WhatsApp.
            </p>
          )}
        </div>
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold">Método de pago</legend>
        <div className="grid grid-cols-2 gap-2">
          <OptionCard<PaymentMethod>
            name="payment"
            value="efectivo"
            current={customer.payment}
            onSelect={(v) => update('payment', v)}
            icon={Banknote}
            title="Efectivo"
            hint="Al recibir"
          />
          <OptionCard<PaymentMethod>
            name="payment"
            value="transferencia"
            current={customer.payment}
            onSelect={(v) => update('payment', v)}
            icon={Landmark}
            title="Transferencia"
            hint="Te pasamos el alias"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold">
          Notas <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Ej: para el sábado a las 17 hs"
          value={customer.notes}
          onChange={(e) => update('notes', e.target.value)}
          className={`${inputClass} resize-none border-line`}
        />
      </div>
    </form>
  );
}
