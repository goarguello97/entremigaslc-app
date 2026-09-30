import type { CartLine, CustomerInfo } from '../types';
import { formatPrice, formatQuantity } from './format';

const PAYMENT_LABELS: Record<CustomerInfo['payment'], string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
};

/** Arma el texto del pedido con el formato (negritas con *) que entiende WhatsApp. */
export function buildOrderMessage(lines: CartLine[], customer: CustomerInfo, total: number): string {
  const delivery =
    customer.delivery === 'retiro' ? 'Retiro por local' : customer.address.trim();

  const detail = lines.map(
    (line) =>
      `- ${formatQuantity(line.halfDozens)} ${line.product.name} (${formatPrice(line.subtotal)})`,
  );

  const message = [
    '¡Hola! Quiero hacer un pedido:',
    `*Cliente:* ${customer.name.trim()}`,
    `*Entrega:* ${delivery}`,
    `*Pago:* ${PAYMENT_LABELS[customer.payment]}`,
    '',
    '*Detalle:*',
    ...detail,
    '',
    `*Total:* ${formatPrice(total)}`,
  ];

  const notes = customer.notes.trim();
  if (notes) message.push('', `*Notas:* ${notes}`);

  return message.join('\n');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Parsea carrito + datos del cliente y devuelve el link wa.me listo para abrir. */
export function buildOrderUrl(
  phone: string,
  lines: CartLine[],
  customer: CustomerInfo,
  total: number,
): string {
  return buildWhatsAppUrl(phone, buildOrderMessage(lines, customer, total));
}
