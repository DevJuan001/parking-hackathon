# Arquitectura — parking-hackathon

Mapas y diagramas de la arquitectura completa del proyecto (backend + frontend + base de datos + infraestructura). Los diagramas están escritos en [Mermaid](https://mermaid.js.org/) y se renderizan automáticamente en GitHub, GitLab, VS Code (con la extensión) y la mayoría de visores de Markdown.

---

## 1. Vista de infraestructura / despliegue

Cómo se levantan los procesos y cómo se comunican entre sí en desarrollo y producción.

```mermaid
flowchart LR
    subgraph Cliente["Navegador del usuario"]
        UI["SPA React 19<br/>(Vite + Tailwind v4)"]
    end

    subgraph Docker["docker-compose (host)"]
        MYSQL[("MySQL 8<br/>:3306<br/>parking_db")]
        REDIS[("Redis 7<br/>:6379")]
    end

    subgraph Backend["Procesos Python (uv)"]
        API["FastAPI<br/>uvicorn :8000"]
        CELERY["Celery Worker<br/>email_tasks"]
    end

    SMTP["SMTP Gmail<br/>:587"]

    UI -- "HTTP + cookies httpOnly<br/>VITE_API_URL" --> API
    API -- "SQL (mysql-connector)" --> MYSQL
    API -- "rate limit + cache" --> REDIS
    API -- "enqueue task<br/>(welcome / recovery)" --> REDIS
    REDIS -- "broker" --> CELERY
    CELERY -- "envía correo" --> SMTP
    CELERY -. "templates Jinja2" .- SMTP
```

**Notas:**

- `docker-compose.yml` solo levanta **MySQL** y **Redis**. FastAPI y Celery se ejecutan fuera de Docker con `uv run` y `celery -A app.core.celery_app worker`.
- CORS en FastAPI está restringido a `http://localhost:5173` (el dev server de Vite).
- Las credenciales nunca viajan en el body: el frontend usa **cookies httpOnly** (`access_token` con path `/`, `refresh_token` con path `/api/auth/refresh`).

---

## 2. Arquitectura del backend — capas

El backend sigue una arquitectura en capas estricta. La regla es: **routes → controller → service → repository → MySQL**. Ninguna capa se salta a la siguiente.

```mermaid
flowchart TD
    Client["Cliente HTTP"] -->|"request"| Router
    subgraph CapaHTTP["Capa HTTP (FastAPI)"]
        Router["routes/*_routes.py<br/><i>declara endpoints, validan esquemas,<br/>aplica RateLimiter y require_roles</i>"]
        Controller["controllers/*_controller.py<br/><i>traduce ServiceError → HTTPException</i>"]
        Router --> Controller
    end

    subgraph CapaNegocio["Capa de negocio"]
        Service["services/*_service.py<br/><i>reglas de negocio, transacciones,<br/>raise ServiceError</i>"]
        Controller --> Service
    end

    subgraph CapaDatos["Capa de datos"]
        Repo["repositories/*_repository.py<br/><i>SQL crudo con mysql-connector,<br/>cursor + commit/rollback</i>"]
        Service --> Repo
    end

    DB[("MySQL")] --> Repo
    Service -. "raise ServiceError" .-> Controller
    Controller -. "HTTPException 400/401/403/404" .-> Client
```

**Reglas:**

- `routes` registra endpoints, aplica `RateLimiter(times=N, seconds=60)` y `Depends(verify_jwt)` / `Depends(require_roles([...]))`.
- `controllers` son **thin**: reciben los datos ya validados, llaman al servicio y mapean `ServiceError.message` a un código HTTP.
- `services` no conocen FastAPI; lanzan `ServiceError(message)`. Aquí viven las reglas ("¿hay plaza libre?", "¿la placa ya tiene entrada activa?", etc.).
- `repositories` ejecutan SQL parametrizado y devuelven diccionarios o tuplas. No hay ORM.
- `models/*_schemas.py` define los **inputs** (request bodies) y `models/*_responses.py` los **outputs**.

---

## 3. Mapa de features del backend

Nueve features, todas con la misma estructura interna.

```mermaid
flowchart LR
    subgraph Auth["auth"]
        AR["routes"]
        AC["controller"]
        AS["service"]
    end

    subgraph Users["users"]
        UR["routes"]
        UC["controller"]
        US["service"]
        UR1["repositories<br/>users + roles"]
    end

    subgraph Entries["entries"]
        ER["routes"]
        EC["controller"]
        ES["service"]
        ER1["repositories"]
    end

    subgraph Exits["exits"]
        XR["routes"]
        XC["controller"]
        XS["service"]
        XR1["repositories"]
    end

    subgraph Parking["parking"]
        PR["routes"]
        PC["controller"]
        PS["service"]
        PR1["repositories<br/>plates + vehicle_types"]
    end

    subgraph Spots["spots"]
        SR["routes"]
        SC["controller"]
        SS["service"]
        SR1["repositories"]
    end

    subgraph Floors["floors"]
        FR["routes"]
        FC["controller"]
        FS["service"]
        FR1["repositories"]
    end

    subgraph Tariffs["tariffs"]
        TR["routes"]
        TC["controller"]
        TS["service"]
        TR1["repositories"]
    end

    subgraph Payments["payments"]
        PR2["routes"]
        PC2["controller"]
        PS2["service"]
        PRR["repositories"]
    end

    %% Dependencias entre features
    AS -->|"get_user_by_email"| US
    ES -->|"find_available_spot<br/>update_spot_status"| SR1
    ES -->|"PlatesRepository"| PR1
    XS -->|"PlatesRepository<br/>update_spot_status<br/>sum_payment_stats"| PR1
    XS -->|"has_active_entry<br/>find_latest_entry_spot"| ER1
    XS -->|"sum_payment_stats"| PRR
    PS -->|"PlatesRepository<br/>VehicleTypesRepository"| PR1
    PS2 -->|"find_latest_entry<br/>create_exit"| ER1
    PS2 -->|"create_exit"| XR1
    PS2 -->|"find_rate_by_vehicle_type"| TR1
    PS2 -->|"PlatesRepository"| PR1
    SS -->|"find_floor_by_id"| FR1
    FS -->|"count_occupied_spots_by_floor<br/>delete_spots_by_floor"| SR1
    TS -->|"count_active_vehicles_by_type"| SR1
```

**Multi-tenant:** cada llamada autenticada carga `parking_id` del usuario en el JWT (vía `verify_jwt`) y lo inyecta en cada query como filtro `WHERE parking_id = %s`. Esto aísla los datos entre parkings.

---

## 4. Modelo de datos (ER)

Las 12 tablas de `db/parking_db_ddl.sql` y sus relaciones.

```mermaid
erDiagram
    ROLES ||--o{ USERS : "role_id"
    PARKINGS ||--o{ USERS : "parking_id"
    PARKINGS ||--o{ FLOORS : "parking_id"
    PARKINGS ||--o{ PLATES : "parking_id"
    PARKINGS ||--o{ ENTRIES : "parking_id"
    PARKINGS ||--o{ EXITS : "parking_id"
    PARKINGS ||--o{ RATES : "parking_id"
    PARKINGS ||--o{ PAYMENTS : "parking_id"

    FLOORS ||--o{ SPOTS : "floor_id (ON DELETE SET NULL)"
    VEHICLE_TYPES ||--o{ PLATES : "vehicle_type_id"
    VEHICLE_TYPES ||--o{ RATES : "vehicle_type_id"

    PLATES ||--o{ ENTRIES : "plate_id"
    PLATES ||--o{ EXITS : "plate_id"
    PLATES ||--o{ PAYMENTS : "plate_id"
    SPOTS ||--o{ ENTRIES : "spot_id (ON DELETE SET NULL)"
    SPOTS ||--o{ PAYMENTS : "spot_id (ON DELETE SET NULL)"
    PAYMENT_METHODS ||--o{ PAYMENTS : "payment_method_id"

    ROLES {
        int id PK
        text name
    }
    PARKINGS {
        int id PK
        text name
        text address
        timestamp created_at
    }
    USERS {
        int id PK
        int role_id FK
        int parking_id FK
        text name
        text first_surname
        text second_surname
        text email
        text password
        timestamp created_at
        int status "1=disabled, 2=active"
    }
    FLOORS {
        int id PK
        int parking_id FK
        text name
        timestamp created_at
    }
    SPOTS {
        int spot_id PK
        int floor_id FK
        text spot
        int spot_status "1=disabled, 2=available, 3=occupied"
        timestamp created_at
    }
    VEHICLE_TYPES {
        int id PK
        text name
    }
    PLATES {
        int id PK
        int parking_id FK
        int vehicle_type_id FK
        varchar_6 plate
        timestamp created_at
    }
    ENTRIES {
        int id PK
        int parking_id FK
        int plate_id FK
        int spot_id FK
        timestamp created_at
    }
    EXITS {
        int id PK
        int parking_id FK
        int plate_id FK
        timestamp created_at
    }
    RATES {
        int id PK
        int parking_id FK
        int vehicle_type_id FK
        float value
        timestamp created_at
        timestamp updated_at
    }
    PAYMENT_METHODS {
        int id PK
        text name
        timestamp created_at
    }
    PAYMENTS {
        int id PK
        int parking_id FK
        int plate_id FK
        int spot_id FK
        float value
        int payment_method_id FK
        timestamp created_at
    }
```

**Códigos de estado relevantes:**

- `USERS.status`: `1` = deshabilitado, `2` = activo.
- `SPOTS.spot_status`: `1` = deshabilitada, `2` = disponible, `3` = ocupada.

---

## 5. Árbol del frontend (SPA)

```mermaid
flowchart TD
    Main["main.jsx<br/>QueryClientProvider"] --> App["App.jsx<br/>BrowserRouter + #modal-root"]
    App --> Router["AppRouter.jsx<br/>Routes"]

    Router --> Login["/login<br/>(público)"]
    Router --> Protected["rutas protegidas<br/>(ProtectedRoutes)"]

    subgraph ProtectedRoutes["ProtectedRoutes.jsx<br/>useCurrentUser + hasRole"]
        direction TB
        Protected --> HomeAdmin["/home · Admin"]
        Protected --> UsersAdmin["/users · Admin"]
        Protected --> EntriesAdmin["/entries · Admin"]
        Protected --> ExitsAdmin["/exits · Admin"]
        Protected --> ParkingAdmin["/parking · Admin"]
        Protected --> TariffsAdmin["/tariffs · Admin (stub)"]
        Protected --> FinanceAdmin["/finance · Admin (stub)"]
        Protected --> CheckInCliente["/check-in · Cliente"]
        Protected --> VehiclePay["/vehicle-payment · Cliente"]
    end

    Login --> LoginPage["LoginPage<br/>LoginForm · LoginButtons<br/>ErrorModal · RecoverPasswordModal"]

    HomeAdmin --> HomePage["HomePage<br/>Layout + HomeSectionsContainer<br/>(SpotsPanel · RecentEntries · Earnings)"]
    UsersAdmin --> UsersPage["UsersPage<br/>TopSection · UsersKpis · UsersTable<br/>+ 4 modales (CRUD + enable/disable)"]
    EntriesAdmin --> EntriesPage["EntriesPage<br/>TopSection · EntriesKpis · EntriesTable<br/>+ CreateEntryModal + FilterModal"]
    ExitsAdmin --> ExitsPage["ExitsPage<br/>TopSection · ExitsKpis · ExitsTable<br/>+ CreateExitModal + FilterModal"]
    ParkingAdmin --> ParkingPage["ParkingPage<br/>Layout + ParkingSectionsContainer<br/>(Spots · Floors · Tariffs) + 6 modales"]
    TariffsAdmin --> TarrifsStub["TarrifsPage (vacío)"]
    FinanceAdmin --> FinanceStub["FinancePage (vacío)"]
    CheckInCliente --> CheckInPage["CheckInPage<br/>CreateEntrySection ↔ SuccessEntrySection"]
    VehiclePay --> VehiclePayment["VehiclePayment<br/>CalculatePaymentSection<br/>CreatePaymentSection<br/>SuccessPaymentSection"]

    subgraph Globals["src/globals (compartido)"]
        G1["hooks: useCurrentUser, useTheme,<br/>useLogout, useModal, useInnerModal,<br/>useFormValidation, useFlipModal, ..."]
        G2["services: getCurrentUser,<br/>logout, updateCurrentUserInfo, ..."]
        G3["components/ui: Icon, Loader, Skeleton,<br/>FormField, CreateButton, FilterButton,<br/>ActionButtons, DateField, Calendar,<br/>TopSection"]
        G4["components/modals: Modal (GSAP Flip),<br/>ModalHighSection, ErrorModal, SuccessModal,<br/>FilterModal, SelectMenu, ConfirmCancelButtons,<br/>ProfileModal (+ EditInfo + ChangePassword)"]
        G5["components/Layout: Layout + Aside + Navbar<br/>(sticky bottom nav, avatar → ProfileModal)"]
    end

    HomePage -. usa .-> G5
    HomePage -. usa .-> G3
    HomePage -. usa .-> G4
    UsersAdmin -. usa .-> G3
    UsersAdmin -. usa .-> G4
    ProtectedRoutes -. usa .-> G1
    Login -. usa .-> G2

    subgraph ServiciosGlobales["Servicios HTTP (uno por feature)"]
        direction LR
        S1["services/login + recoverPassword<br/>(fetch crudo, sin wrapper)"]
        S2["services/users (10 endpoints)"]
        S3["services/entries · exits · spots<br/>floors · tariffs · payments"]
    end

    Login --> S1
    UsersAdmin --> S2
    EntriesAdmin --> S3
    ExitsAdmin --> S3
    ParkingAdmin --> S3
    VehiclePay --> S3

    subgraph Utils["src/utils"]
        U1["fetchWithAuth<br/>(401 → /auth/refresh → retry una vez)"]
        U2["buildQueryParams"]
        U3["formatDateTime / formatTime / months"]
    end

    S2 --> U1
    S3 --> U1
    S1 -. "fetch directo" .-> U1
```

**Stack:** React 19 + Vite 8 + Tailwind v4 + React Router v7 + TanStack Query 5 + GSAP 3 (Flip para animar modales) + Recharts 3 (cargado pero sin uso real en `EarningsChart`).

**Estado global:** solo `QueryClient` (sin Redux/Zustand/Context). El usuario actual vive en `["currentUser"]` y se invalida al hacer login/logout/editar perfil.

---

## 6. Mapa completo de endpoints REST

Todos los recursos. La base es `http://localhost:8000/api`.

```mermaid
flowchart LR
    subgraph Auth["/api/auth"]
        A1["POST /login<br/>30/min"]
        A2["POST /refresh<br/>40/min"]
        A3["POST /verify-roles<br/>50/min · JWT"]
        A4["POST /logout"]
        A5["POST /recover-password<br/>3/min"]
    end

    subgraph Users["/api/users"]
        U1["GET / · Admin"]
        U2["GET /me · Admin/Cliente"]
        U3["GET /roles · Admin"]
        U4["GET /by-stats · Admin"]
        U5["GET /{id} · Admin"]
        U6["POST /create · Admin"]
        U7["PUT /update/me · Admin/Cliente"]
        U8["PUT /update-password · Admin/Cliente"]
        U9["PUT /update/{id} · Admin"]
        U10["PUT /disable/{id} · Admin"]
        U11["PUT /enable/{id} · Admin"]
    end

    subgraph Entries["/api/entries"]
        E1["GET / · Admin"]
        E2["GET /recent-entries · Admin"]
        E3["GET /by-stats · Admin"]
        E4["GET /plate/{plate_id} · Admin"]
        E5["GET /{id} · Admin"]
        E6["POST /create · JWT (cualquier rol)"]
    end

    subgraph Exits["/api/exits"]
        X1["GET / · Admin"]
        X2["GET /plate/{plate_id} · Admin"]
        X3["GET /stats · Admin"]
        X4["GET /{id} · Admin"]
        X5["POST /create · JWT"]
    end

    subgraph Parking["/api/parking"]
        P1["GET /plates · Admin"]
        P2["GET /spots · Admin"]
        P3["GET /plates/find/{plate} · Admin"]
        P4["POST /plates/create · Admin"]
    end

    subgraph Spots["/api/spots"]
        SP1["GET / · JWT"]
        SP2["GET /{id} · JWT"]
        SP3["POST /create · JWT"]
        SP4["PUT /{id}/status · JWT"]
        SP5["PUT /update/{id} · JWT"]
        SP6["DELETE /delete/{id} · JWT"]
    end

    subgraph Floors["/api/floors"]
        F1["GET / · JWT"]
        F2["GET /{id} · JWT"]
        F3["POST /create · JWT"]
        F4["PUT /update/{id} · JWT"]
        F5["DELETE /delete/{id} · JWT"]
    end

    subgraph Tariffs["/api/tariffs"]
        T1["GET / · Admin"]
        T2["GET /{id} · Admin"]
        T3["POST /create · Admin"]
        T4["PUT /update/{id} · Admin"]
        T5["DELETE /delete/{id} · Admin"]
    end

    subgraph Payments["/api/payments"]
        PAY1["GET / · Admin"]
        PAY2["GET /calculate/?plate= · Cliente"]
        PAY3["GET /plate/{plate_id} · Admin"]
        PAY4["GET /{id} · Admin"]
        PAY5["POST /create · Cliente"]
    end
```

**Totales:** 5 auth + 11 users + 6 entries + 5 exits + 4 parking + 6 spots + 5 floors + 5 tariffs + 5 payments = **52 endpoints** de feature + 2 de sistema (`/`, `/ping-db`).

**Rate limiting:** todos los endpoints llevan `RateLimiter(times=N, seconds=60)`. Los más agresivos: `recover-password` 3/min, `entries/create` y `users/create` 10/min, `spots/` 300/min.

---

## 7. Flujo de autenticación

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant FE as Frontend (React)
    participant API as FastAPI
    participant DB as MySQL
    participant R as Redis

    U->>FE: Introduce email + password
    FE->>API: POST /api/auth/login<br/>(credentials: include)
    API->>DB: SELECT * FROM USERS WHERE email = ?
    DB-->>API: usuario + hash bcrypt
    API->>API: verify_password(plain, hash)
    alt credenciales OK
        API->>API: create_access_token(sub, role, exp 15m)<br/>create_refresh_token(exp 7d)
        API-->>FE: 200 OK + Set-Cookie:<br/>access_token (path=/, httponly)<br/>refresh_token (path=/api/auth/refresh, httponly)
        FE->>API: GET /api/users/me<br/>(cookie access_token)
        API->>DB: SELECT role_id, parking_id FROM USERS
        API-->>FE: { user_id, role, parking_id }
        FE->>FE: navigate("/home" | "/check-in") según rol
    else credenciales inválidas
        API-->>FE: 401 "Credenciales invalidas"
        FE->>U: Abre ErrorModal
    end

    Note over API,R: FastAPILimiter incrementa contador en Redis<br/>para el rate limit (30/min en /login)

    rect rgb(245, 245, 245)
    Note over FE,API: Petición autenticada posterior
    FE->>API: GET /api/X (cookie access_token)
    alt token válido
        API-->>FE: respuesta normal
    else token expirado (401)
        FE->>API: POST /api/auth/refresh<br/>(cookie refresh_token)
        alt refresh OK
            API-->>FE: nuevas cookies access + refresh
            FE->>API: reintenta la request original
        else refresh falla
            FE->>FE: window.location = "/login"
        end
    end
```

**Decisión clave:** el frontend **nunca** lee el JWT. Todo viaja en cookies httpOnly. `fetchWithAuth` envuelve cada llamada: si llega 401, llama a `/auth/refresh` una sola vez (compartiendo `refreshPromise` con llamadas concurrentes) y reintenta.

---

## 8. Flujo del dominio — Entrada, cobro y salida

El ciclo de vida principal del producto.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente (en el parquímetro)
    actor O as Operador (admin)
    participant FE as Frontend
    participant API as FastAPI
    participant DB as MySQL

    rect rgb(230, 245, 255)
    Note over C,DB: 1) ENTRADA — POST /api/entries/create
    C->>FE: Teclea la placa
    FE->>API: POST /api/entries/create { plate }
    API->>API: formatea placa (mayúsculas, sin guiones)
    API->>API: detecta vehicle_type_id<br/>(último char alfa → 2=moto, numérico → 1=carro)
    API->>DB: SELECT * FROM PLATES WHERE parking_id=? AND plate=?
    alt placa nueva
        API->>DB: INSERT INTO PLATES
    end
    API->>DB: ¿hay entrada activa?<br/>MAX(created_at) entries vs MAX(created_at) exits
    alt ya tiene entrada activa
        API-->>FE: 400 "La placa ya tiene una entrada activa"
    else no
        API->>DB: SELECT * FROM SPOTS WHERE spot_status=2 LIMIT 1<br/>JOIN FLOORS
        alt no hay plazas libres
            API-->>FE: 400 "No hay plazas disponibles"
        else hay plaza
            API->>DB: INSERT INTO ENTRIES (parking_id, plate_id, spot_id)
            API->>DB: UPDATE SPOTS SET spot_status=3 WHERE spot_id=?
            API-->>FE: "Dirígete al piso {n} y a la plaza {x}"
            FE->>C: Muestra SuccessEntrySection (auto-reset 8s)
        end
    end
    end

    rect rgb(255, 245, 230)
    Note over C,DB: 2) CÁLCULO — GET /api/payments/calculate/?plate=
    C->>FE: Teclea la placa + "Calcular"
    FE->>API: GET /api/payments/calculate/?plate=...
    API->>DB: SELECT * FROM PLATES ... PLATE
    API->>DB: SELECT MAX(entries.created_at) latest entry
    API->>DB: SELECT value FROM RATES WHERE parking_id=? AND vehicle_type_id=?
    API->>API: hours = round((now - entry_time)/3600, 2)<br/>total = round(hours * rate, 2)
    API-->>FE: { plate, entry_time, exit_time=now, hours, rate, total }
    FE->>C: Muestra el monto a pagar
    end

    rect rgb(230, 255, 230)
    Note over C,DB: 3) PAGO — POST /api/payments/create
    C->>FE: Confirma y elige método
    FE->>API: POST /api/payments/create { plate, exit_time, payment_method }
    API->>DB: recalcula total con el exit_time recibido
    API->>DB: INSERT INTO EXITS (parking_id, plate_id)
    API->>DB: INSERT INTO PAYMENTS (parking_id, plate_id, value, payment_method_id)
    API-->>FE: 200 OK
    FE->>C: SuccessPaymentSection
    Note right of DB: ⚠️ Esta vía NO libera la plaza<br/>(spot_status sigue en 3)
    end

    rect rgb(255, 230, 230)
    Note over O,DB: 4) SALIDA ADMIN — POST /api/exits/create (alternativa)
    O->>FE: Registra salida desde el panel admin
    FE->>API: POST /api/exits/create { plate }
    API->>DB: lookup plate + última entrada
    API->>DB: INSERT INTO EXITS
    API->>DB: UPDATE SPOTS SET spot_status=2<br/>WHERE spot_id = (último de la entrada)
    API-->>FE: 200 OK
    Note right of API: Esta vía SÍ libera la plaza<br/>pero NO crea PAYMENT
    end
```

**Punto de fricción detectado:** existen dos caminos para cerrar un vehículo — `payments/create` (que crea EXITS + PAYMENTS pero deja la plaza ocupada) y `exits/create` (que crea EXITS y libera la plaza pero sin pago). En la práctica, el flujo del cliente solo registra el cobro; un operador debe liberar la plaza después, o la app necesita una reconciliación.

---

## 9. Mapa de componentes globales reutilizables

```mermaid
flowchart TB
    subgraph Layout["Layout (todas las páginas admin)"]
        L1["Layout.jsx<br/>main + Aside"]
        L2["Aside.jsx"]
        L3["Navbar.jsx<br/>firstSection + 'more options'"]
        L4["NavItem.jsx<br/>+ NavbarMenuModal"]
        L5["AvatarButton.jsx<br/>→ abre ProfileModal"]
    end

    subgraph UI["ui/* (átomos)"]
        UI1["Icon (material-symbols)"]
        UI2["Loader / Skeleton (shimmer)"]
        UI3["FormField (floating label)"]
        UI4["CreateButton / FilterButton / ActionButtons"]
        UI5["DateField → Calendar (grid mensual)"]
        UI6["TopSection (header de página)"]
    end

    subgraph Modals["modals/* (sistema de modales)"]
        M1["Modal (portal #modal-root + GSAP Flip)"]
        M2["ModalHighSection (header edit)"]
        M3["ErrorModal / SuccessModal"]
        M4["FilterModal (rango fechas + children)"]
        M5["SelectMenu (searchable list)"]
        M6["ConfirmCancelButtons"]
        M7["AddInnerModal (sub-modal)"]
        M8["ProfileModal → General / Appearance<br/>+ EditInfoModal + ChangePasswordModal"]
    end

    subgraph Hooks["hooks/*"]
        H1["useCurrentUser / useLogout / useTheme"]
        H2["useModal / useInnerModal<br/>(triggerRef + boundingRect)"]
        H3["useFlipModal (animación GSAP)"]
        H4["useFormValidation (required + getChanges)"]
        H5["useCalendar / useSelectMenu"]
        H6["useUpdateCurrentUserInfo / Password"]
    end

    Layout --> UI
    Layout --> Modals
    Modals --> Hooks
    UI --> Hooks
```

**Sistema de modales — pieza más distintiva del frontend:** cada `<Modal>` se abre animando desde el `boundingRect` del elemento que lo disparó (morphing con GSAP Flip) y se cierra volviendo al mismo punto. `location` y `growDirection` parametrizan la posición final (centro, esquinas, anclado al disparador). Las modales anidadas usan `useInnerModal` + `<AddInnerModal>`.

---

## 10. Resumen de una sola vista

```mermaid
flowchart LR
    subgraph Dev["Docker compose"]
        MY[("MySQL 8")]
        RD[("Redis 7")]
    end

    subgraph BE["Backend (uv + Python 3.13)"]
        F["FastAPI :8000<br/>9 routers · 52 endpoints"]
        C["Celery worker<br/>welcome + recovery emails"]
        F -. enqueue .-> RD
        RD -. broker .-> C
    end

    subgraph FE2["Frontend (Vite + React 19)"]
        R["React Query + Router 7<br/>10 módulos (admin + cliente)"]
    end

    SMTP["Gmail SMTP"]

    R -- "HTTP + cookies httpOnly" --> F
    F -- "mysql-connector" --> MY
    F -- "rate limit" --> RD
    C -- "SMTP" --> SMTP
```

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| **Cliente** | React 19, Vite 8, Tailwind v4, React Router 7, TanStack Query 5, GSAP 3 | UI, fetch con cookies, animaciones de modales, sin estado global (solo React Query) |
| **API** | FastAPI, Pydantic v2, Pydantic-Settings, PyJWT, bcrypt | Endpoints REST, validación, JWT, rate limit (Redis) |
| **Workers** | Celery 5 + Redis broker + FastMail + Jinja2 | Emails transaccionales (bienvenida, recuperación) |
| **Persistencia** | MySQL 8 (utf8mb4) + mysql-connector-python | 12 tablas, multi-tenant por `parking_id`, índices por FK |
| **Cache / broker** | Redis 7 | Rate limiting + broker de Celery |
| **Auth** | JWT HS256 (access 15m, refresh 7d) en cookies httpOnly | `verify_jwt` carga `user_id`, `role`, `parking_id` y lo inyecta en cada request |
