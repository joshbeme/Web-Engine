import zod, { json } from "zod";
import path from "path";
import { writeFile, readdir, unlinkSync } from "fs";
import * as allTypes from "../bridge-type-schemas";

const bridgeTypesPath = path.join(__dirname, "..", "bridge-type-schemas");
export const generateJsonSchemas = () => {
  readdir(bridgeTypesPath, (err, files) => {
    if (err) {
      console.error("Error reading bridge-type-schemas directory:", err);
      return;
    }

    files.forEach((file) => {
      if (
        path.extname(file) === ".json" &&
        !Object.keys(allTypes).includes(path.basename(file, ".schema.json"))
      ) {
        unlinkSync(path.join(bridgeTypesPath, file));
        console.log(`Deleted old schema file: ${file}`);
      }
    });
  });

  Object.entries(allTypes).forEach(([name, schema]) => {
    console.log(`Processing schema: ${name}`);
    const jsonSchema = zod.toJSONSchema(schema);
    jsonSchema.title = name;
    writeFile(
      path.join(bridgeTypesPath, `${name}.schema.json`),
      JSON.stringify(jsonSchema, null, 2),
      (err) => {
        if (err) {
          console.error(`Error writing JSON schema for ${name}:`, err);
        } else {
          console.log(`Wrote JSON schema for ${name}`);
        }
      }
    );
  });
};
