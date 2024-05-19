# Dailyscrum

# Notes

- `pnpm add <package name> --filter <app name</app> --workspace` to add a package to a workspace
  - e.g. `pnpm add ui --filter dailyscrum --workspace`

- fly deploy --config apps/core/fly.toml --dockerfile ./apps/core/Dockerfile

- pnpm exec nx dev dailyscrum