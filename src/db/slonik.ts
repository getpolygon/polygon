import { createPool, createTypeParserPreset } from "slonik";

export default createPool(process.env.DATABASE_URL!!, {
  typeParsers: [...createTypeParserPreset()],
});
