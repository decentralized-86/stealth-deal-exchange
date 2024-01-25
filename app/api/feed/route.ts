import redisClient from "@/lib/redis";

export const GET = async () => {
  try {
    const [latestPairs, topTokens] = await Promise.all([
      redisClient.get("latestPairs"),
      redisClient.get("topTokens"),
    ]);

    return Response.json({
      // new
      latestPairs: JSON.parse(latestPairs ?? ""),
      // trending
      topTokens: JSON.parse(topTokens ?? ""),
    });
  } catch (e) {
    return Response.json(JSON.stringify(e), { status: 400 });
  }
};
