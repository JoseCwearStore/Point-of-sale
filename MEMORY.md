# MEMORY.md — Memoria del proyecto

## Sobre este documento

Esta es la bitácora viva del proyecto. Sirve para que cualquiera (Jose, o una
sesión de IA nueva que no tiene el historial de conversación) pueda leer esto
y entender en 2 minutos qué es el proyecto, cómo está construido, qué
decisiones ya se tomaron (y por qué) y en qué quedó cada módulo, sin tener
que releer semanas de chat.

Dos secciones importan para mantenerla viva:

- **Estado de los módulos**: se actualiza cada vez que un módulo cambia de
  fase (ej. de "en progreso" a "completo"), no todos los días.
- **Registro de sesiones**: se le agrega una entrada nueva al final, cada
  sesión de trabajo. Nunca se reescribe lo viejo, solo se agrega abajo.

Si esto se automatiza después (ej. un script o un hook que corre al cerrar
sesión), el formato de cada entrada de sesión está pensado para ser
predecible: fecha, qué se hizo, qué se decidió, qué quedó pendiente.

## Resumen del proyecto

- **Qué es**: un sistema de Punto de Venta (POS) genérico, construido como
  pieza de portafolio/CV y para aprender arquitectura limpia a fondo.
- **Stack**: React 19 + Tailwind CSS (frontend, Vite), Node.js + Express 5
  (backend), PostgreSQL + Prisma (ORM), TypeScript en todo el proyecto.
- **Estructura**: monorepo con npm workspaces (`apps/client`, `apps/server`).
- **Arquitectura**: hexagonal, por módulo de negocio. Cada módulo de backend
  sigue siempre: `domain/` → `ports/` → `application/` →
  `infrastructure/{prisma,http}/`.
- **Base de datos**: PostgreSQL vía Docker Compose (`docker/docker-compose.yml`),
  base `pos_system`, puerto 5432.
- **Cómo correr**: `npm run dev` dentro de `apps/server` (API en
  `http://localhost:4000`, prefijo `/api`) y dentro de `apps/client` (Vite,
  `http://localhost:5173`). Requiere la base de Postgres levantada por Docker.
- **Ubicación**: `C:\React Proyects\Punto Venta` (máquina de Jose, Windows).
  Se trabaja vía puente de dispositivo remoto: las órdenes de shell corren en
  una VM Linux aparte con esa carpeta montada, por lo que no se puede tocar
  `localhost`/Postgres de Jose directamente desde ahí — solo archivos.

## Convenciones y decisiones de arquitectura (acumuladas)

- **Taxonomía de errores** (`shared/errors.ts`): `NotFoundError` → 404,
  `ConflictError` → 409, `ValidationError` → 400. Cada controller los mapea
  en su `catch` con `instanceof`.
- **Validaciones en dos capas**: reglas genéricas que aplican a cualquier
  entidad (ej. formato de nombre) viven en `shared/validators.ts` (back) y
  `shared/validators.ts` del cliente (front). Reglas específicas de una sola
  entidad (abreviación, teléfono, precio, cantidad) viven en el `rules.ts` de
  ese módulo (back) o inline en su hook (front).
- **Tipos de entrada derivados de la entidad**: `NewX = Pick<X, campos
  obligatorios> & Partial<Pick<X, campos opcionales>>`; `XUpdate =
  Partial<Pick<X, campos editables>>`. Cuando el campo necesita una forma
  distinta a la de la entidad completa (ej. un arreglo de otro tipo), ya no
  se puede usar `Pick` — se escribe la interfaz a mano (`Omit` sirve para
  "todos los campos menos estos", útil cuando faltan `id`/`saleId` porque
  aún no existen al momento de construir el dato).
- **Campos calculados, nunca persistidos**: `slug` (Category),
  `priceWithTax` (Product) — se calculan al leer con una función pura de
  dominio y se agregan a la respuesta de la API, nunca se guardan en la
  base de datos.
- **Reglas de borrado en Prisma**: `onDelete: Restrict` para proteger
  integridad referencial (no se puede borrar algo que otra tabla referencia
  — ej. no borrar una Categoría con Productos). `onDelete: Cascade` para
  composición padre-hijo real, donde el hijo no tiene sentido sin el padre
  (ej. `SaleItem`/`SalePayment` dependen de `Sale`).
- **Flujo de migraciones de Prisma**: nunca se escribe `migration.sql` a
  mano. Siempre: editar `schema.prisma` → `npx prisma migrate dev --name X
  --create-only` (genera sin aplicar) → revisar el SQL generado → `npx
  prisma migrate dev` (aplica). Si el servidor (`tsx watch`) sigue corriendo,
  `prisma generate` puede fallar por un lock de Windows en el binario del
  engine — hay que detener el servidor antes de generar.
- **PrismaClient compartido**: vive en `shared/prisma.ts`, un archivo hoja
  sin dependencias, para evitar un ciclo de imports (cada módulo lo importa
  de ahí, nunca crea su propia instancia ni lo importa de `routes.ts`).
- **Frontend**: patrón `useX()` hook + `XPage` componente de solo JSX. Para
  entidades con muchos campos de formulario se usa un solo `useState` con un
  objeto tipado (ej. `ProductFormState`) y un setter genérico `updateField`,
  en vez de un `useState` por campo.
- **Git**: `git add` siempre selectivo (nunca `-A`/`.`), un commit por
  cambio lógico. El commit/push real se corre en la PowerShell de Jose en
  Windows — la VM del puente no tiene identidad de git configurada, así que
  desde ahí solo se hace `git add` y se preparan los mensajes.

## Lecciones aprendidas (para no repetir los mismos bugs)

- `if (value)` salta la validación cuando `value` es `0` — un valor
  legítimo pero falsy. Usar `value !== undefined` cuando el campo es
  opcional, o validar sin condición cuando es obligatorio.
- Una columna `@db.Decimal` de Prisma regresa un objeto `Decimal` de
  decimal.js, no un `number` de JS — hay que convertir con `Number(...)`
  al mapear de la fila de Prisma al dominio.
- El accessor del Prisma Client (`prisma.producto`, `prisma.sale`, etc.) sale
  del nombre del **modelo** en singular/camelCase, no del `@@map`.
- `findUnique` solo funciona en campos `@unique` o la llave primaria; para
  buscar por un campo no único (ej. "¿existe algún producto con esta
  categoría?") se usa `findFirst`.
- Un enum de TypeScript sin valores explícitos (`enum X { "A", "B" }`) es
  numérico por dentro (0, 1, 2...) aunque el nombre del miembro está entre
  comillas — para que el valor real sea el texto, o se le pone
  `= "A"` explícito a cada miembro, o (más simple y lo que se usa en este
  proyecto) se usa un tipo unión de strings: `type X = "A" | "B"`.
- Un `catch` que solo revisa `instanceof NotFoundError` deja pasar sin
  capturar cualquier otro error de negocio (`ConflictError`,
  `ValidationError`) que se agregue después — hay que revisar los
  controllers viejos cuando un caso de uso empieza a lanzar un tipo de
  error que antes no lanzaba.

## Estado de los módulos

### Categorías — completo
CRUD + `slug` calculado automático + validación de nombre (back y front).
Bloquea su propio borrado si tiene Productos relacionados (`ConflictError`,
409).

### Unidades — completo
CRUD + validación de nombre y de abreviación (máximo 4 caracteres
alfanuméricos, sin símbolos). Bloquea su propio borrado si tiene Productos
relacionados.

### Sucursales — completo
CRUD + validación de nombre y teléfono (10 dígitos, `+` opcional solo al
inicio).

### Productos — completo
CRUD completo. IVA fijo de 16% (`priceWithTax` se calcula al vuelo, nunca se
guarda). `imageUrl` como texto simple por ahora (diseño pensado para poder
cambiar a subida real de archivos después sin tocar el resto). `stock` como
`Decimal` (admite fracciones, para productos que se venden por peso/volumen
como "Kilogramo"). Probado en vivo de punta a punta: crear, editar, validar
precio inválido, eliminar, y el bloqueo de borrado de Categoría/Unidad con
Productos relacionados.

### Ventas — en progreso

Decisiones de alcance ya confirmadas:
- **Pago dividido**: una venta puede combinar varios métodos de pago (no
  uno solo por venta) → existe tabla/entidad `SalePayment` aparte.
- **Stock insuficiente bloquea la venta** (no se permite dejar stock en
  negativo).
- **Sin folio legible todavía** — por ahora el id interno (uuid) es
  suficiente; se puede agregar un folio secuencial más adelante sin romper
  nada.
- **La cantidad vendida puede ser decimal** (ej. 1.5 kg), porque ya existe
  la unidad "Kilogramo" en el catálogo — forzar enteros rompería la venta
  por peso.

Hecho hasta ahora:
- Dominio (`sale.entity.ts`): `Sale`, `SaleItem`, `SalePayment`,
  `PaymentMethod`, `SaleStatus`, `NewSale`/`NewSaleItemInput`/
  `NewSalePaymentInput` (lo que manda el cliente) y `NewSaleRecord` (lo que
  el caso de uso arma ya con precios y totales calculados, listo para
  persistir).
- Reglas de dominio (`sale.rules.ts`): `assertValidQuantity`,
  `computeSaleTotals` (subtotal/tax/total a partir de los items),
  `assertPaymentsMatchTotal` (la suma de los pagos debe cuadrar con el
  total, con tolerancia de centavos).
- Schema de Prisma + migración aplicada (`add_sales`): tablas `sales`,
  `sale_items`, `sale_payments`; se agregó `stock` a `products`.
- Puerto `SaleRepositoryPort`: `create`, `findById`, `list`, `cancel` (sin
  `update` genérico — una venta no se edita campo por campo).

Pendiente:
- `ProductRepositoryPort`: agregar métodos para descontar/reponer stock.
- Casos de uso: `CreateSaleUseCase` (el más grande — transacción de Prisma,
  valida stock contra la base de datos, arma los snapshots de precio,
  descuenta inventario, todo o nada), `ListSalesUseCase`,
  `GetSaleByIdUseCase`, `CancelSaleUseCase` (repone stock).
- Infraestructura: `PrismaSaleRepository`, controller + rutas HTTP.
- Frontend completo: types → api → queries → hook → page (mismo patrón que
  Producto).

## Registro de sesiones

### Resumen histórico (hasta 2026-10-01)
Se construyeron Categorías, Unidades y Sucursales completos (CRUD + validación
de nombre/abreviación/teléfono en back y front). Se agregó `.gitattributes`
para resolver ruido de line-endings Windows/Linux. Se construyó Producto
completo: dominio, reglas (IVA fijo 16%), Prisma, repositorio, casos de uso,
controller/rutas, y todo el frontend (types, api, queries, hook con patrón
`ProductFormState`, page) — probado en vivo end-to-end con el navegador. Se
encontró y corrigió un bug sistémico: el frontend leía `error.message` de las
respuestas de error en vez de `error.error` (el backend siempre manda
`{ error: "..." }`), y faltaban los `onError` en varias mutaciones. Se
diagnosticó y corrigió una dependencia circular del `PrismaClient` compartido.
Se implementó el bloqueo de borrado de Categoría/Unidad cuando tienen
Productos relacionados, incluyendo un bug de copy-paste
(`existsByCategoryId` usado por error en el caso de uso de Unidad) y dos
controllers que no capturaban `ConflictError` en su `delete` (causaba 500 en
vez de 409) — todo encontrado probando en vivo, no solo leyendo código.

### 2026-10-02
- Se definió el alcance del módulo de Ventas vía preguntas de arquitectura:
  pago dividido, bloqueo de stock insuficiente, sin folio por ahora.
- Se escribió el dominio de Ventas pieza por pieza (entidades → reglas),
  cada una revisada: se corrigieron un `enum` mal usado (quedaba numérico
  por dentro en vez de string), `saleId` sobrando en los tipos de entrada,
  y `amountReceived` que debía ser nulo para pagos que no son en efectivo.
- Se diseñó y aplicó el schema de Prisma del módulo de Ventas (migración
  `add_sales`): tablas `sales`, `sale_items`, `sale_payments`, y se agregó
  `stock` a `products`.
- Se encontró y corrigió un bug en `product.repository.ts`: el nuevo campo
  `stock` no se convertía de `Decimal` a `number` al leer, y no se mandaba
  a Prisma al crear/actualizar un producto.
- Se definió el puerto `SaleRepositoryPort`.
- Se creó este archivo (`MEMORY.md`).
- Siguiente paso: `CreateSaleUseCase` (el caso de uso grande, con
  transacción y descuento de stock).
