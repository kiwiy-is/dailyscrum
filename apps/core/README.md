# dailyscrum-core

## Prerequisites

Ensure you have one of the following clients installed:

- Docker Desktop (macOS, Windows, Linux)
- Rancher Desktop (macOS, Windows, Linux)
- OrbStack (macOS)
- Colima (macOS)

## Running the Client

### Start Local Supabase Service

To start the Supabase service, use the following command:
```bash
supabase start
```

### Environment Configuration

Create a `.env.local` file and configure your environment variables:
```plaintext
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_METADATA_BASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ASSET_PREFIX=
```

### Running the Client

To run the client, use:
```bash
pnpm run dev
```

## Additional Information

### Running the Client with Live Server

To run a client that connects to the live (real or production) server, set up `.env.live.local` then use:
```bash
pnpm run dev:live
```


### Stopping Services

- **Stop Supabase Service**:
   ```bash
   supabase stop
   ```

- **Reset Local Database and Stop Supabase Service**:
   ```bash
   supabase stop --no-backup
   ```

### Updating Configuration

After updating `supabase/config.toml`, restart the Supabase service:
```bash
supabase stop
supabase start
```

### Verification Code

For signing in or signing up, check Inbucket at [http://127.0.0.1:54324](http://127.0.0.1:54324) to get the verification code.