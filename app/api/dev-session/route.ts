// The startup session is constant for one dev-server process.
// Static export renders the production 404 instead of requiring a server.
export const dynamic = 'force-static';

export function GET() {
  if (process.env.NODE_ENV !== 'development') return new Response(null, { status: 404 });
  return new Response(process.env.KOD_SMECE_DEV_SESSION || 'next-development', {
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain' },
  });
}
