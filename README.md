# Entre Migas: pedidos de sándwiches de miga por WhatsApp

Aplicación web (SPA) para que los clientes de **Entre Migas** (Los Cóndores, Córdoba) armen su pedido de sándwiches de miga desde el celular y lo envíen directamente al WhatsApp del local, con un mensaje ya formateado.

No tiene backend: el menú, los precios y los datos del local se leen de una **planilla de Google Sheets** que el negocio edita, el carrito se guarda en el navegador y el pedido termina en un link `https://wa.me/`. Se puede publicar en cualquier hosting de sitios estáticos.

---

## Tabla de contenidos

- [Características](#características)
- [Cómo funciona un pedido](#cómo-funciona-un-pedido)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación y uso](#instalación-y-uso)
- [Administrar el menú desde Google Sheets](#administrar-el-menú-desde-google-sheets)
- [Variables de entorno](#variables-de-entorno)
- [Personalización del código](#personalización-del-código)
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
- **Menú administrable desde Google Sheets**: el negocio cambia variedades, precios, disponibilidad, número de WhatsApp y textos sin tocar código ni volver a publicar la app.
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
- 1 Docena Jamón y Queso ($20.000)
- 1/2 Docena Mortadela y Queso ($11.000)

*Total:* $31.000

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
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo con recarga en caliente. |
| `npm run build` | Verifica tipos con `tsc` y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente el contenido de `dist/` para probar el build. |

## Administrar el menú desde Google Sheets

El menú y los datos del local se cargan desde una planilla de Google publicada como CSV. Quien tenga permiso de edición en la planilla puede cambiar la carta sin intervención técnica.

### Pestaña `Menu`

Una fila por variedad. Los encabezados de la fila 1 tienen que ser exactamente estos (se toleran mayúsculas y tildes):

| nombre | descripcion | precio_docena | precio_media | disponible | categoria |
| --- | --- | --- | --- | --- | --- |
| Mortadela y Queso | Mortadela, queso y mayonesa en pan de miga triple. | 20000 | 11000 | SI | clasicos |

- **`nombre` y `precio_docena`** son obligatorios; las filas sin ellos se ignoran.
- **Precios:** se aceptan `20000`, `20.000` o `$20.000`. Si `precio_media` está vacío, se usa la mitad de la docena.
- **`disponible`:** con `NO` la variedad se oculta. Vacío o `SI` la muestra.
- **`categoria`:** `clasicos`, `especiales` o `veggie`. Define el color de fondo de la ilustración; cualquier otro valor cuenta como `clasicos`.
- **Orden:** el de las filas.
- **Ilustración:** los colores de los rellenos se eligen solos según los ingredientes que aparecen en el nombre o la descripción (mortadela, jamón, pollo, verdeo, tomate, huevo, etc.). La lista está en [`src/data/fillings.ts`](src/data/fillings.ts).

### Pestaña `Config`

Pares clave y valor. La columna A no se modifica; se edita la B. Filas extra o claves desconocidas se ignoran.

| clave | valor | Uso |
| --- | --- | --- |
| `whatsapp` | `5493511234567` | Número al que llegan los pedidos (549 + área sin 0 + número sin 15). |
| `nombre` | `Entre Migas` | Título de la pestaña del navegador. |
| `instagram` | `entremigas.lc` | Link del pie de página. Acepta el usuario, con o sin `@`, o el link completo. |
| `localidad` | `Los Cóndores, Córdoba` | Texto del pie de página. |
| `aviso` | `Los pedidos quedan sujetos a disponibilidad. ...` | Recuadro del menú. La primera oración se muestra en negrita. |

Si falta un valor o no es válido (por ejemplo, un WhatsApp con pocos dígitos), se usa el valor por defecto de [`src/config.ts`](src/config.ts).

### Publicación y tiempos

- Cada pestaña se publica desde **Archivo → Compartir → Publicar en la Web** como **Valores separados por comas (.csv)**, con **Volver a publicar automáticamente cuando se realicen cambios** activado.
- Google actualiza el CSV publicado cada **5 minutos aproximadamente**, así que los cambios tardan eso en verse en la web.
- La versión publicada es pública, igual que la web. La planilla en sí puede quedar con acceso restringido.
- **Seguridad:** quien pueda editar la planilla puede cambiar el número de WhatsApp al que llegan los pedidos. Dar permiso de edición solo a los dueños.
- **No renombrar** pestañas, encabezados de `Menu` ni claves de `Config`; eso rompe la lectura.

## Variables de entorno

Son todas opcionales: la app ya trae los links de la planilla y valores por defecto en [`src/config.ts`](src/config.ts). Para sobrescribirlos, crear un `.env` en la raíz a partir de `.env.example`.

| Variable | Descripción |
| --- | --- |
| `VITE_SHEET_MENU_URL` | Link CSV de la pestaña `Menu`. Si se define vacío, se usa el menú local de [`src/data/products.ts`](src/data/products.ts) (útil para desarrollar sin conexión). |
| `VITE_SHEET_CONFIG_URL` | Link CSV de la pestaña `Config`. |
| `VITE_WHATSAPP_NUMBER` | Número de respaldo si `Config` no carga. Solo dígitos, formato internacional. |
| `VITE_STORE_NAME` | Nombre de respaldo del local. |

> Las variables `VITE_*` se incrustan en el JavaScript final durante el build, así que son públicas. No guardes secretos en ellas.

Si cambiás el `.env`, reiniciá `npm run dev` o volvé a correr `npm run build`.

## Personalización del código

### Precios y cantidades

Las cantidades se guardan en medias docenas. El subtotal es `docenas completas × precio_docena + media docena suelta × precio_media`. Por ejemplo, con docena a $20.000 y media a $11.000, 1½ docenas = $31.000.

`MAX_HALF_DOZENS` en [`src/config.ts`](src/config.ts) define el tope por variedad (40 medias docenas, o sea 20 docenas).

### Textos fijos

- **Portada:** [`src/components/Hero.tsx`](src/components/Hero.tsx).
- **Sección "Quiénes somos":** [`src/components/About.tsx`](src/components/About.tsx).
- **Bajada del menú ("Todos llevan mayonesa...")**: [`src/components/ProductList.tsx`](src/components/ProductList.tsx).
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
│   │   ├── ProductList.tsx      # Menú, aviso, filtros y estados de carga/error
│   │   ├── QuantityStepper.tsx  # Control de cantidad en medias docenas
│   │   ├── SandwichArt.tsx      # Ilustración SVG del sándwich (mascota)
│   │   └── Wordmark.tsx         # Logo "entre migas" en texto
│   ├── context/
│   │   ├── CartContext.tsx      # Estado global del carrito
│   │   └── CatalogContext.tsx   # Menú y datos del local (planilla + caché)
│   ├── data/
│   │   ├── fillings.ts          # Colores de relleno según ingredientes
│   │   ├── products.ts          # Categorías, colores y menú local de respaldo
│   │   └── sheet.ts             # Lectura y validación de la planilla
│   ├── utils/
│   │   ├── csv.ts               # Parser CSV
│   │   ├── format.ts            # Precios, cantidades y subtotales
│   │   └── whatsapp.ts          # Armado del mensaje y del link wa.me
│   ├── App.tsx
│   ├── config.ts                # Links de la planilla y valores por defecto
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

### Catálogo desde la planilla

[`CatalogContext.tsx`](src/context/CatalogContext.tsx) descarga las pestañas `Menu` y `Config` al abrir la página ([`sheet.ts`](src/data/sheet.ts)), las valida y las expone con el hook `useCatalog()`.

- **Primera visita:** se muestran fichas de carga con la forma de las reales hasta que llega la planilla.
- **Visitas siguientes:** se muestra al instante la última versión guardada y se actualiza en segundo plano.
- **Si la planilla falla** (sin conexión, link roto, más de 10 segundos): con una copia guardada se sigue usando esa; sin copia, se muestra un mensaje con botón **Reintentar**.
- **Si falla solo `Config`:** el menú se muestra igual y se usan los valores por defecto.
- El `id` de cada variedad se genera a partir del nombre. Cuando llega el menú actualizado, se quitan del carrito las variedades que ya no existen o se marcaron como no disponibles.

### Estado del carrito

[`CartContext.tsx`](src/context/CartContext.tsx) guarda el carrito como un mapa `idDeProducto → cantidad en medias docenas`, manejado con un reducer (`add`, `set`, `remove`, `clear`). A partir de ese estado se calculan las líneas con subtotal, el total y la cantidad de variedades.

El hook `useCart()` expone el estado y las acciones, además de abrir y cerrar el panel del pedido.

### Persistencia

Se usa `localStorage`, siempre dentro de `try/catch`: si el navegador lo bloquea (por ejemplo, en modo privado), la app sigue funcionando sin guardar nada.

| Clave | Contenido |
| --- | --- |
| `miga-cart-v1` | Carrito actual. |
| `miga-catalog-v1` | Última versión del menú y la configuración leída de la planilla. |
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

- **Vercel o Netlify:** importar el repositorio. Comando de build: `npm run build`. Carpeta de salida: `dist`. No hace falta configurar variables: los links de la planilla ya están en el código.
- **GitHub Pages:** si el sitio se sirve desde `https://<usuario>.github.io/<repositorio>/`, agregar `base: '/<repositorio>/'` en [`vite.config.ts`](vite.config.ts) antes de construir.

## Limitaciones y próximos pasos

- **Sin backend:** los pedidos no quedan registrados en ningún lado; el historial vive en el chat de WhatsApp.
- **Demora en los cambios:** lo que se edita en la planilla tarda unos 5 minutos en verse, por el caché de Google.
- **Depende de Google:** si Google Sheets no responde, los clientes nuevos ven el mensaje de error; los que ya visitaron la web ven la última versión guardada.
- **Costo de envío:** no se calcula; se coordina por WhatsApp.
- **Stock y horarios:** no se controlan desde la app; por eso el aviso de disponibilidad.
- **Imágenes:** las ilustraciones son SVG hechos a mano; el logo se escribe con una tipografía similar a la original. Cuando haya fotos reales de los productos y los archivos oficiales de la marca, conviene incorporarlos.
- **Ideas a futuro:** elegir fecha y horario de entrega, abrir y cerrar la toma de pedidos desde la planilla, y medir cuántos pedidos se inician y se envían.

## Licencia

© 2026 Gonzalo Argüello ([@goarguello97](https://github.com/goarguello97)). Todos los derechos reservados.

- **Código fuente:** propiedad del autor. No se permite usarlo, copiarlo, modificarlo ni distribuirlo sin autorización escrita.
- **Marca Entre Migas:** el nombre, el logo, la mascota, la identidad visual y los contenidos del negocio pertenecen a sus titulares y no están incluidos en los derechos del código.
- **Dependencias de terceros:** mantienen sus propias licencias de código abierto.

Detalle completo en [LICENSE](LICENSE).
