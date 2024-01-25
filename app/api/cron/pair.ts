import getPair from "@/worker/index";

export const GET = async () => {
  getPair();
  return Response.json({ result: "ok" });
};
