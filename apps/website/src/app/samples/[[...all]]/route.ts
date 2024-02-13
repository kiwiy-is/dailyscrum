export async function GET(request: Request) {
  console.log("HI!");
  return new Response(null, {
    status: 204,
    headers: { "fly-replay": "app=dailyscrum" },
  });
}
