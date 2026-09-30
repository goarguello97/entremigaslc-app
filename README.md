# Entre Migas: pedidos de sándwiches de miga por WhatsApp

Aplicación web (SPA) para que los clientes de **Entre Migas** (Los Cóndores, Córdoba) armen su pedido de sándwiches de miga desde el celular y lo envíen directamente al WhatsApp del local, con un mensaje ya formateado.

No tiene backend: el catálogo vive en el código, el carrito se guarda en el navegador y el pedido termina en un link `https://wa.me/`. Se puede publicar en cualquier hosting de sitios estáticos.

---

## Tabla de contenidos

- [Características](#características)
- [Cómo funciona un pedido](#cómo-funciona-un-pedido)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación y uso](#instalación-y-uso)
- [Variables de entorno](#variables-de-entorno)
- [Personalización](#personalización)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Sistema de diseño](#sistema-de-diseño)
- [Accesibilidad](#accesibilidad)
- [Deploy](#deploy)
- [Limitaciones y próximos pasos](#limitaciones-y-próximos-pasos)
- [Licencia](#licencia)

---

## Características

- **Catálogo** de variedades con nombre, descripción, precio por docena y por media docena, e ilustración propia de cada sándwich.
- **Selector de cantidad** en pasos de media docena (½, 1, 1½, 2 docenas...) antes de agregar al pedido.
- **Carrito** como panel inferior en celular y lateral en escritorio: permite cambiar cantidades, eliminar variedades y ver el total calculado al instante.
- **Barra flotante** en celular con la cantidad de variedades y el total, para abrir el pedido desde cualquier parte de la página.
- **Checkout breve**: nombre, tipo de entrega (envío a domicilio con dirección, o retiro por el local), método de pago (efectivo o transferencia) y notas opcionales.
- **Validación** del formulario con mensajes debajo de cada campo y foco automático en el primer error.
- **Envío por WhatsApp** con el mensaje armado y codificado en la URL (`wa.me/<número>?text=...`), más un link de respaldo si WhatsApp no se abre solo.
- **Persistencia local**: el carrito y los datos del cliente (nombre, dirección, preferencias) se recuerdan entre visitas.
- **Aviso de disponibilidad** visible en el menú y en el carrito: todo pedido queda sujeto a confirmación.
- **Modo oscuro automático** según la preferencia del sistema.
- **Mobile-first** y con respeto por `prefers-reduced-motion`.

## Cómo funciona un pedido

1. El cliente elige variedades y cantidades en el menú y las agrega al pedido.
2. Abre el carrito, ajusta cantidades y completa sus datos.
3. Toca **Enviar por WhatsApp**: se abre WhatsApp con este mensaje listo para enviar al local.

```text
¡Hola! Quiero hacer un pedido:
*Cliente:* Juan Pérez
*Entrega:* Calle Falsa 123
*Pago:* Transferencia

*Detalle:*
- 1 Docena Jamón y Queso ($13.000)
- 1/2 Docena Mortadela y Queso ($6.500)

*Total:* $19.500

*Notas:* Para el sábado a las 17 hs
```

Si elige retiro, la línea de entrega dice `Retiro por local`. La línea de notas solo aparece si se completó. Los asteriscos se ven como negrita en WhatsApp.

4. El local revisa la disponibilidad y confirma el pedido por el mismo chat.

## Stack tecnológico

| Área | Herramienta |
| --- | --- |
| Build y dev server | [Vite](https://vite.dev/) 8 |
| UI | [React](https://react.dev/) 19 + TypeScript |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) v4 (plugin `@tailwindcss/vite`) |
| Estado del carrito | Context API + `useReducer` |
| Íconos | [Lucide React](https://lucide.dev/) |
| Tipografías | [Outfit](https://fontsource.org/fonts/outfit) y [Caveat Brush](https://fontsource.org/fonts/caveat-brush), incluidas en el proyecto vía Fontsource |

No hay librerías de animación: todo el movimiento está hecho con CSS.

## Requisitos

- **Node.js** 20.19+ o 22.12+ (requisito de Vite 8).
- **npm** (incluido con Node).

## Instalación y uso

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>
npm install
cp .env.example .env   # y completar el número de WhatsApp real
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo con recarga en caliente. |
| `npm run build` | Verifica tipos con `tsc` y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente el contenido de `dist/` para probar el build. |

## Variables de entorno

Se definen en un archivo `.env` en la raíz (no se sube al repositorio; usar `.env.example` como base).

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | Número del local en formato internacional, **solo dígitos**. En Argentina: `549` + código de área sin `0` + número sin `15`. | `5493511234567` |
| `VITE_STORE_NAME` | Nombre del local. | `Entre Migas` |

> Las variables `VITE_*` se incrustan en el JavaScript final durante el build, así que son públicas. No guardes secretos en ellas. El número de WhatsApp es público por naturaleza, así que no es un problema.

Si cambiás el `.env`, reiniciá `npm run dev` o volvé a correr `npm run build`.

## Personalización

### Menú y precios

El catálogo está en [`src/data/products.ts`](src/data/products.ts). Cada variedad tiene esta forma:

```ts
{
  id: 'jamon-queso',                 // identificador único, sin espacios
  name: 'Jamón y Queso',
  description: 'Jamón cocido o paleta, queso y mayonesa en pan de miga triple.',
  category: 'clasicos',              // 'clasicos' | 'especiales' | 'veggie'
  priceDozen: 13000,                 // precio de la docena
  priceHalfDozen: 7000,              // precio de la media docena
  layers: ['#E59383', '#F1C23E'],    // colores de los dos rellenos en la ilustración
}
```

- **Cálculo del precio:** las cantidades se guardan en medias docenas. El subtotal es `docenas completas × priceDozen + media docena suelta × priceHalfDozen`. Por ejemplo, 1½ docenas de Jamón y Queso = 13.000 + 7.000 = $20.000.
- **Categoría:** define el color de fondo de la ilustración. Los filtros por categoría aparecen solos cuando el menú supera las 6 variedades.
- **Si cambiás o borrás un `id`:** los carritos guardados con ese id se limpian automáticamente al cargar.

### Datos del local

En [`src/config.ts`](src/config.ts):

| Constante | Uso |
| --- | --- |
| `INSTAGRAM_HANDLE` | Usuario de Instagram del pie de página. |
| `LOCATION` | Localidad que se muestra en el pie. |
| `MAX_HALF_DOZENS` | Tope de cantidad por variedad (por defecto 40 medias docenas, o sea 20 docenas). |

### Textos

- **Portada:** [`src/components/Hero.tsx`](src/components/Hero.tsx).
- **Sección "Quiénes somos":** [`src/components/About.tsx`](src/components/About.tsx).
- **Aviso de disponibilidad:** [`src/components/ProductList.tsx`](src/components/ProductList.tsx) y [`src/components/Cart.tsx`](src/components/Cart.tsx).
- **Formato del mensaje de WhatsApp:** [`src/utils/whatsapp.ts`](src/utils/whatsapp.ts).

## Estructura del proyecto

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── About.tsx            # Sección "Quiénes somos"
│   │   ├── Cart.tsx             # Panel del pedido (items, total, estados vacío y enviado)
│   │   ├── CartBar.tsx          # Barra flotante del pedido en celular
│   │   ├── CheckoutForm.tsx     # Datos del cliente, validación y envío
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx             # Portada
│   │   ├── Navbar.tsx           # Logo y acceso al pedido con contador
│   │   ├── ProductCard.tsx      # Ficha de una variedad con selector de cantidad
│   │   ├── ProductList.tsx      # Menú, aviso de disponibilidad y filtros
│   │   ├── QuantityStepper.tsx  # Control de cantidad en medias docenas
│   │   ├── SandwichArt.tsx      # Ilustración SVG del sándwich (mascota)
│   │   └── Wordmark.tsx         # Logo "entre migas" en texto
│   ├── context/
│   │   └── CartContext.tsx      # Estado global del carrito
│   ├── data/
│   │   └── products.ts          # Catálogo y colores por categoría
│   ├── utils/
│   │   ├── format.ts            # Precios, cantidades y subtotales
│   │   └── whatsapp.ts          # Armado del mensaje y del link wa.me
│   ├── App.tsx
│   ├── config.ts                # Configuración del local
│   ├── index.css                # Tailwind, colores, modo oscuro y animaciones
│   ├── main.tsx                 # Punto de entrada, fuentes y provider
│   ├── types.ts
│   └── vite-env.d.ts
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Arquitectura

### Estado del carrito

[`CartContext.tsx`](src/context/CartContext.tsx) guarda el carrito como un mapa `idDeProducto → cantidad en medias docenas`, manejado con un reducer (`add`, `set`, `remove`, `clear`). A partir de ese estado se calculan las líneas con subtotal, el total y la cantidad de variedades.

El hook `useCart()` expone el estado y las acciones, además de abrir y cerrar el panel del pedido.

### Persistencia

Se usa `localStorage`, siempre dentro de `try/catch`: si el navegador lo bloquea (por ejemplo, en modo privado), la app sigue funcionando sin guardar nada.

| Clave | Contenido |
| --- | --- |
| `miga-cart-v1` | Carrito actual. |
| `miga-customer-v1` | Nombre, entrega, dirección y método de pago. Las notas no se guardan porque son de cada pedido. |

### Envío por WhatsApp

[`whatsapp.ts`](src/utils/whatsapp.ts) tiene tres funciones puras:

- `buildOrderMessage(lines, customer, total)` arma el texto del pedido.
- `buildWhatsAppUrl(phone, message)` limpia el número y codifica el mensaje con `encodeURIComponent`.
- `buildOrderUrl(...)` combina las dos anteriores.

El formulario abre el link con `window.open` y guarda la URL para mostrar el link de respaldo "¿No se abrió WhatsApp? Tocá acá".

## Sistema de diseño

La identidad visual está tomada de los posteos de la marca en Instagram ([@entremigas.lc](https://www.instagram.com/entremigas.lc/)).

| Rol | Color |
| --- | --- |
| Mostaza (superficie de marca) | `#F1C23E` |
| Terracota (logo e ilustraciones) | `#C5583B` |
| Terracota para acciones (contraste AA con texto claro) | `#B04A2F` |
| Crema (fondo) | `#FBF3E8` |
| Marrón (texto y contornos) | `#3A1F12` |
| Verde salvia (rellenos) | `#949366` |

- **Colores como variables:** están definidos en [`src/index.css`](src/index.css) (`--paper`, `--ink`, `--accent`, etc.) y expuestos a Tailwind con `@theme inline`, así que clases como `bg-paper` o `text-accent` cambian solas en modo oscuro.
- **Un solo color de acción:** terracota. El mostaza se usa como superficie de marca, nunca en botones.
- **Formas:** botones, pills y controles de cantidad son totalmente redondeados. Los contenedores (cards, portada, panel del pedido) usan 24px de radio; los elementos internos y los inputs, 16px.
- **Tipografía:** Outfit para toda la interfaz; Caveat Brush solo para toques manuscritos de la marca (logo, frase de "Quiénes somos", "¡Pedido listo!").
- **Movimiento:** entrada escalonada en la portada, saludo de la mascota al cargar (se repite tres veces y se detiene), aparición de las fichas al hacer scroll (solo en navegadores con `animation-timeline`) y transiciones del panel del pedido. Con `prefers-reduced-motion: reduce`, todo queda estático.

## Accesibilidad

- El panel del pedido es un `dialog` modal: se cierra con `Escape` o tocando afuera, bloquea el scroll de fondo y pone el foco en el botón de cerrar.
- Todos los botones que solo tienen ícono llevan `aria-label` descriptivo (por ejemplo, "Sumar media docena de Mortadela y Queso").
- Las cantidades se anuncian a lectores de pantalla con `aria-live`.
- Los campos del formulario tienen etiqueta visible arriba, `aria-invalid` y el error vinculado con `aria-describedby`.
- El foco de teclado es visible en toda la interfaz.
- Los pares de color de texto y botones cumplen contraste WCAG AA en modo claro y oscuro.

## Deploy

`npm run build` genera una carpeta `dist/` con archivos estáticos que se pueden publicar en cualquier hosting.

- **Vercel o Netlify:** importar el repositorio. Comando de build: `npm run build`. Carpeta de salida: `dist`. Cargar `VITE_WHATSAPP_NUMBER` (y opcionalmente `VITE_STORE_NAME`) en las variables de entorno del proyecto.
- **GitHub Pages:** si el sitio se sirve desde `https://<usuario>.github.io/<repositorio>/`, agregar `base: '/<repositorio>/'` en [`vite.config.ts`](vite.config.ts) antes de construir. Como las variables se leen en el build, hay que definirlas en el workflow (por ejemplo, como *secrets* o *variables* del repositorio).

## Limitaciones y próximos pasos

- **Sin backend:** los pedidos no quedan registrados en ningún lado; el historial vive en el chat de WhatsApp.
- **Menú y precios de prueba:** hay que reemplazarlos por los reales en `src/data/products.ts`.
- **Costo de envío:** no se calcula; se coordina por WhatsApp.
- **Stock y horarios:** no se controlan desde la app; por eso el aviso de disponibilidad.
- **Imágenes:** las ilustraciones son SVG hechos a mano; el logo se escribe con una tipografía similar a la original. Cuando haya fotos reales de los productos y los archivos oficiales de la marca, conviene incorporarlos.
- **Ideas a futuro:** administrar el menú desde una planilla o un CMS liviano, elegir fecha y horario de entrega, y medir cuántos pedidos se inician y se envían.

## Licencia

© 2026 Gonzalo Argüello ([@goarguello97](https://github.com/goarguello97)). Todos los derechos reservados.

- **Código fuente:** propiedad del autor. No se permite usarlo, copiarlo, modificarlo ni distribuirlo sin autorización escrita.
- **Marca Entre Migas:** el nombre, el logo, la mascota, la identidad visual y los contenidos del negocio pertenecen a sus titulares y no están incluidos en los derechos del código.
- **Dependencias de terceros:** mantienen sus propias licencias de código abierto.

Detalle completo en [LICENSE](LICENSE).
