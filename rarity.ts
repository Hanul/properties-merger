import fs from "fs";
import merged from "./merged.json";

const totalCount = merged.length;

const result: any = { totalCount };

const scores: { [id: number]: number } = {};

const traitCounts: {
    [traitCount: number]: {
        count: number,
        percent: number,
        ids: number[],
    },
} = {};

const traits: {
    [trait: string]: {
        [value: string]: {
            count: number,
            percent: number,
            score: number,
            ids: number[],
        },
    },
} = {};

for (const [id, info] of merged.entries()) {

    //const traitCount = Object.keys(info).length - 1;
    const traitCount = Object.keys(info).length;
    if (traitCounts[traitCount] === undefined) {
        traitCounts[traitCount] = {
            count: 0,
            percent: 0,
            ids: [],
        };
    }
    traitCounts[traitCount].count += 1;
    traitCounts[traitCount].ids.push(id);

    for (const [trait, value] of Object.entries<string>(info)) {
        //if (trait !== "Level") {
        if (traits[trait] === undefined) {
            traits[trait] = {};
        }
        if (traits[trait][value] === undefined) {
            traits[trait][value] = {
                count: 0,
                percent: 0,
                score: 0,
                ids: [],
            };
        }
        traits[trait][value].count += 1;
        traits[trait][value].ids.push(id);
        //}
    }
}

for (const info of Object.values(traitCounts)) {
    info.percent = info.count / totalCount * 100;
}

for (const [trait, values] of Object.entries(traits)) {
    values[""] = {
        count: 0,
        percent: 0,
        score: 0,
        ids: [],
    };
    for (const [id, info] of merged.entries()) {
        if ((info as any)[trait] === undefined) {
            values[""].count += 1;
            values[""].ids.push(id);
        }
    }
}

for (const values of Object.values(traits)) {
    for (const info of Object.values(values)) {
        info.percent = info.count / totalCount * 100;
        info.score = 1 / (info.count / totalCount);
        for (const id of info.ids) {
            if (scores[id] === undefined) {
                scores[id] = 0;
            }
            scores[id] += info.score;
        }
    }
}

result.scores = scores;
result.traitCounts = traitCounts;
result.traits = traits;

fs.writeFileSync("./rarity.json", JSON.stringify(result));