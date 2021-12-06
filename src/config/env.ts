export const jwt = process.env.JWT_SECRET;
export const redis = process.env.REDIS_URL;
export const refresh = process.env.JWT_REFRESH;
export const postgres = process.env.DATABASE_URL;
export const port = process.env.PORT || process.env.POLYGON_PORT || 3001;
export const configPath = process.env.POLYGON_CONFIG_PATH || "config.yaml";
