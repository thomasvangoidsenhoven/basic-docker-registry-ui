# Docker Registry UI

A modern, lightweight web interface for browsing and managing Docker container images in a Docker Registry V2.

## Features

- **Browse Repositories** - View all repositories in your registry with search filtering
- **Tag Management** - List and sort tags by version, view tag details
- **Image Inspection** - Full manifest details including architecture, OS, entrypoint, environment variables, labels, and layer information
- **Delete Images** - Remove unwanted images with confirmation dialogs
- **Multi-architecture Support** - Handles manifest lists and OCI indices
- **Authentication** - Basic auth support with session-based credential storage

## Tech Stack

- **Svelte 5** with SvelteKit 2
- **TypeScript**
- **Tailwind CSS v4**
- **Vite**
- **Nginx** (production server)

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Docker

### Build and Run

```bash
docker build -t docker-registry-ui .
docker run -p 8082:8082 docker-registry-ui
```

The app will be available at `http://localhost:8082`.

### Build Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `PUBLIC_DEFAULT_REGISTRY_URL` | Pre-filled registry URL in the login form | `http://localhost:5050` |

Example with custom default registry:

```bash
docker build \
  --build-arg PUBLIC_DEFAULT_REGISTRY_URL=https://registry.example.com \
  -t docker-registry-ui .
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_DEFAULT_REGISTRY_URL` | Default registry URL shown in the login form | `http://localhost:5050` |

## Usage

1. Enter your Docker Registry URL (e.g., `https://registry.example.com`)
2. Provide credentials if required (username and password)
3. Click **Connect** to authenticate
4. Browse repositories, view tags, and inspect image details

## Project Structure

```
src/
├── routes/                 # SvelteKit pages
│   ├── +page.svelte       # Home (repository list)
│   └── [...repo]/         # Repository and tag views
├── lib/
│   ├── registry-client.ts # Docker Registry V2 API client
│   ├── components/        # Svelte components
│   │   ├── registry/      # Domain-specific components
│   │   ├── ui/            # Reusable UI components
│   │   └── layout/        # Layout components
│   ├── stores/            # Svelte stores (auth state)
│   └── utils/             # Formatting utilities
└── styles.css             # Global styles
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Type check |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run Playwright tests |

## Registry Requirements

This UI works with any Docker Registry V2 compatible registry. The registry must have the following endpoints available:

- `GET /v2/_catalog` - List repositories
- `GET /v2/{name}/tags/list` - List tags
- `GET /v2/{name}/manifests/{reference}` - Get manifest
- `DELETE /v2/{name}/manifests/{reference}` - Delete manifest (if deletion is enabled)

For image deletion to work, your registry must have `REGISTRY_STORAGE_DELETE_ENABLED=true`.

## License

BSD 2-Clause