// GitHub project pages live under /KodSmece; local development uses the root.
export function assetPath(path: string) {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? '') + path;
}
