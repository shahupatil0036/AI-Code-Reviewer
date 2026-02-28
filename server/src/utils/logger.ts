import morgan from "morgan";
import { env } from "../config/env";

/**
 * Request logger — uses "dev" format locally for concise coloured output,
 * "combined" in production for proper access-log style logging.
 */
export const requestLogger = morgan(
    env.NODE_ENV === "production" ? "combined" : "dev"
);
