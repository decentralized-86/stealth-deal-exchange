import Redis from "ioredis";
import config from "@/next.config";

const client = new Redis(config.redis);

export default client;
