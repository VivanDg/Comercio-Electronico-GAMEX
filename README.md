# Gamex Import E-Commerce Platform

Plataforma e-commerce completa para **Gamex Import (E.I.R.L.)** — venta de productos tecnológicos con gestión de inventario, pagos Mercado Pago y panel administrativo.

## Arquitectura

```
Frontend (Next.js 14) → API REST (Node.js Modular) → PostgreSQL (Prisma) → Mercado Pago / Resend
```

- **Backend**: Monolito modular con 10 dominios independientes
- **Frontend**: Next.js + TypeScript + TailwindCSS (SSR/CSR híbrido)
- **Base de datos**: PostgreSQL con Prisma ORM
- **Infraestructura**: Docker Compose

## Módulos Backend

| Módulo | Descripción |
|--------|-------------|
| Auth | Registro, login, JWT, roles |
| Users | Gestión de usuarios (ADMIN) |
| Products | CRUD productos con filtros |
| Categories | CRUD categorías |
| Inventory | Control de stock en tiempo real |
| Cart | Carrito de compras |
| Orders | Pedidos con estados controlados |
| Payments | Integración Mercado Pago + webhooks |
| Notifications | Emails transaccionales (Resend) |
| Admin | Dashboard y logs de operaciones |

## Inicio Rápido

### Requisitos

- Node.js 20+
- Docker & Docker Compose
- Cuenta Mercado Pago (developers)
- Cuenta Resend (emails)

### Con Docker (recomendado)

```bash
# 1. Clonar y configurar
cp .env.example .env
# Editar .env con tus credenciales de Mercado Pago y Resend

# 2. Levantar servicios
docker compose up -d postgres backend frontend

# 3. Ejecutar migraciones y seed
docker compose --profile seed run --rm seed
```

Acceder a:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Health check**: http://localhost:4000/api/v1/health

### Desarrollo Local

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev

# Frontend (otra terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Credenciales por Defecto (Seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@gameximport.com | Admin123! |

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Registro
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/auth/profile` — Perfil (JWT)

### Productos
- `GET /api/v1/products?search=&categoryId=&minPrice=&maxPrice=` — Catálogo con filtros
- `GET /api/v1/products/:id` — Detalle
- `POST/PUT/DELETE /api/v1/products` — CRUD (ADMIN)

### Carrito & Pedidos
- `GET/POST/PUT/DELETE /api/v1/cart` — Carrito
- `POST /api/v1/orders` — Crear pedido desde carrito
- `GET /api/v1/orders/my` — Historial del cliente

### Pagos
- `POST /api/v1/payments/preference` — Crear preferencia Mercado Pago
- `POST /api/v1/payments/webhook` — Webhook de confirmación

### Admin
- `GET /api/v1/admin/dashboard` — Estadísticas
- `GET /api/v1/admin/logs` — Logs de operaciones

## Reglas de Negocio Implementadas

- RN01: Email único por usuario
- RN02: No venta sin stock
- RN03: Stock se descuenta tras pago confirmado (webhook)
- RN04: Pedido válido solo con pago aprobado
- RN05: Pedido siempre asociado a usuario autenticado
- RN06: Transiciones de estado controladas
- RN07-RN09: Solo ADMIN gestiona catálogo, RBAC en endpoints
- RN10: Logs de operaciones en base de datos

## Seguridad

- JWT con cookies httpOnly
- bcrypt (12 rounds) para contraseñas
- RBAC (CLIENT / ADMIN)
- Helmet (XSS), CORS, Rate Limiting
- Validación con Zod en todos los endpoints
- Prisma ORM (protección SQL injection)

## Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── src/
│   │   ├── modules/        # 10 módulos de dominio
│   │   ├── common/         # Errores, logger, middleware
│   │   ├── config/         # Variables de entorno
│   │   ├── middlewares/    # Auth, seguridad
│   │   └── database/       # Prisma client
│   └── prisma/             # Schema + seed
├── frontend/
│   ├── app/                # Páginas Next.js
│   ├── components/         # UI components
│   ├── services/           # API client
│   └── hooks/              # Auth & Cart context
└── docker-compose.yml
```

## Licencia

Proyecto académico — Gamex Import E.I.R.L.
