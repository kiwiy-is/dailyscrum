export async function GET(request: Request) {
  return new Response(null, {
    status: 204,
    headers: { "fly-replay": "app=dailyscrum-core" },
  });
}
