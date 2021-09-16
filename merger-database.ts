import fs from "fs";
import database from "./database.json";

const results: any[] = [];
for (let id = 0; id < 10000; id += 1) {
    const info = (database as any)[id];
    const result: any = {};
    for (const attribute of info.attributes) {
        result[attribute.trait_type] = attribute.value;
    }
    results.push(result);
}
fs.writeFileSync("./merged.json", JSON.stringify(results));