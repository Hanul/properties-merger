import fs from "fs";

const results: any[] = [];
for (let id = 0; id < 10000; id += 1) {
    const info = JSON.parse(fs.readFileSync(`./json/${id}.json`).toString());
    const result: any = {};
    for (const attribute of info.attributes) {
        result[attribute.trait_type] = attribute.value;
    }
    results.push(result);
}
fs.writeFileSync("./merged.json", JSON.stringify(results));