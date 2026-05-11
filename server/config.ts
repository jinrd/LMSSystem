import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_for_dev";
export const PORT = process.env.PORT || 5001;
