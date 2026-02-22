import { z } from "zod";

const envSchema = z.object({
    OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    CORS_ORIGIN: z.string().default("*"),
}).refine(
    (data) => data.NODE_ENV !== "production" || data.CORS_ORIGIN !== "*",
    { message: "CORS_ORIGIN must be explicitly set in production (cannot be '*')" }
);

export type EnvConfig = z.infer<typeof envSchema>;

function loadEnvConfig(): EnvConfig {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        const formatted = result.error.format();
        console.error("❌ Invalid environment variables:", formatted);
        throw new Error(
            `Invalid environment variables: ${JSON.stringify(formatted)}`
        );
    }

    return result.data;
}

export const env = loadEnvConfig();
