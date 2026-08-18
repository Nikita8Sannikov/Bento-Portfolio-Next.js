# Bento Portfolio

A dynamic portfolio builder with editable bento-style tiles.

The project is built as a fullstack application with Next.js and provides an admin interface for managing portfolio content, tile layouts, images and interactive map locations.

## Features

* Dynamic bento-style portfolio layout
* Admin authentication
* Create and edit portfolio tiles
* Drag-and-drop tile reordering
* Multiple tile types:

  * text
  * image
  * link
  * map
* Multiple tile sizes:

  * square
  * wide
  * tall
* Image uploads to S3-compatible storage
* Interactive map tiles with MapLibre
* PostgreSQL persistence
* Input validation with Zod
* Dockerized development and production environments
* Automated tests with Vitest

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* dnd-kit
* MapLibre GL

### Backend

* Next.js Server Actions / server-side logic
* NextAuth
* Prisma ORM
* Zod
* bcrypt

### Database

* PostgreSQL
* Prisma ORM

### Storage

* S3-compatible object storage
* AWS SDK

### Infrastructure

* Docker
* Docker Compose

### Testing

* Vitest

## Architecture

```text
                        ┌─────────────────────┐
                        │      Browser        │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │      Next.js        │
                        │   App Router / UI   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌────────────┐ ┌────────────┐ ┌────────────┐
             │ PostgreSQL │ │ S3 Storage │ │  MapLibre  │
             │  + Prisma  │ │   Images   │ │    Maps    │
             └────────────┘ └────────────┘ └────────────┘
```

Portfolio data and tile configuration are stored in PostgreSQL.

Images are stored separately in S3-compatible object storage, while the application stores references to uploaded assets.

Interactive map tiles use MapLibre for location visualization and coordinate selection.

## Data Model

The application is based around two main entities:

```text
Portfolio
   │
   └── Tile[]
```

A portfolio contains multiple tiles.

Each tile stores:

* type
* size
* title
* position
* grid position
* type-specific content

Supported tile types:

```text
text
image
link
map
```

Supported sizes:

```text
square
wide
tall
```

Tile-specific data is stored as JSON, allowing different tile types to share the same base model while keeping their own content structure.

## Authentication

The administration interface is protected with authentication based on NextAuth.

Passwords are stored as hashes using bcrypt.

Only authenticated users can create, edit, delete or reorder portfolio content.

## Drag and Drop

Tile positioning is implemented with `dnd-kit`.

Users can reorder tiles through the admin interface and the resulting order is persisted in PostgreSQL.

The database also stores grid coordinates and tile dimensions to keep the portfolio layout consistent between sessions.

## Map Tiles

Map tiles are implemented with MapLibre GL.

The editor allows geographical coordinates to be associated with a tile and displayed as an interactive map inside the portfolio.

## Image Storage

Images are uploaded to S3-compatible object storage using the AWS SDK.

This keeps binary files outside of the application database while PostgreSQL stores portfolio metadata and references to uploaded assets.

## Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
├── scripts/
├── src/
│
├── Dockerfile
├── compose.yaml
├── docker-compose.production.yml
├── prisma.config.ts
├── vitest.config.ts
└── next.config.ts
```

## Getting Started

### Requirements

* Node.js
* Docker
* Docker Compose

### Clone the repository

```bash
git clone https://github.com/Nikita8Sannikov/Bento-Portfolio-Next.js.git
cd Bento-Portfolio-Next.js
```

### Install dependencies

```bash
npm install
```

### Environment variables

Create an `.env` file and configure the required environment variables for:

```text
PostgreSQL
Authentication
S3-compatible storage
```

Do not commit production secrets to the repository.

### Start infrastructure

```bash
docker compose up -d
```

### Run database migrations

```bash
npx prisma migrate dev
```

### Start development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Production

The repository contains a separate production Docker Compose configuration:

```bash
docker compose \
  --env-file .env.production \
  -f docker-compose.production.yml \
  up -d --build
```

## Testing

Tests are run with Vitest.

```bash
npm run test
```

For watch mode:

```bash
npm run test:watch
```

## Technical Challenges

Some of the main engineering challenges in the project:

* synchronizing drag-and-drop UI state with persisted tile positions
* designing a flexible data model for different tile types
* handling image uploads separately from database records
* integrating interactive maps into editable portfolio tiles
* separating development and production Docker environments
* combining server-side and client-side logic in Next.js App Router
* keeping client state synchronized after server-side mutations

## Roadmap

* [ ] Expand automated test coverage
* [ ] Add CI pipeline with GitHub Actions
* [ ] Improve image optimization
* [ ] Improve mobile drag-and-drop behavior
* [ ] Add additional tile types
* [ ] Add portfolio themes
* [ ] Add public portfolio sharing and metadata customization
