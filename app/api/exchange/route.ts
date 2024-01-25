import supabase from "@/lib/supabase";

export const GET = async () => {
  const { data } = await supabase.from("exchange").select();
  return Response.json(data?.map((item) => item.swap_id));
};

export const POST = async (request: Request) => {
  const req = await request.json();
  const { error } = await supabase
    .from("exchange")
    .insert({ swap_id: req.swapId });
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
  return Response.json({});
};

export const DELETE = async (request: Request) => {
  const res = await request.json();
  await supabase.from("exchange").delete().eq("swapid", res.swap_id);
  return Response.json({});
};
