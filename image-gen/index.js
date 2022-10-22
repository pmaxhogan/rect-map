import puppeteer from "puppeteer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import {readFile, writeFile, mkdir, appendFile} from "fs/promises";
import "./queue.js";
import Queue from "./queue.js";

async function makeDirectoyIfNotExists(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
    } catch (err) {
        if(e.code !== "ENOENT") {
            throw e;
        }
    }
}

const header = "id,names-x1,names-y1,names-x2,names-y2,pfp-x1,pfp-y1,pfp-x2,pfp-y2\n";
const flushEvery = 500;

(async () => {
    await makeDirectoyIfNotExists("images");

    try {
        await readFile("data.csv", "utf8");
    } catch (e) {
        if(e.code === "ENOENT") {
            await writeFile("data.csv", header);
        }else{
            throw e;
        }
    }

    const browser = await puppeteer.launch({
        // devtools: true,
    });

    let data = "";

    async function flush(){
        console.log("Flushing data", data.length);
        await appendFile("data.csv", data);
        data = "";
        console.log("Flushed data");
    }

    const functions = [];
    for(let i = 0; i < 100000; i++) {
        functions.push(async () => {
            const id = uuidv4()
            const firstTwo = id.substring(0, 2);
            const rest = id.substring(2);

            const page = await browser.newPage();

            await page.goto(`${path.join(path.dirname(import.meta.url), "gen.html")}`);

            await page.waitForNetworkIdle({timeout: 3000});
            const element = await page.$("#main");

            const boxes = await page.evaluate(() => getBoundingBoxes());


            await makeDirectoyIfNotExists(`images/${firstTwo}`);
            await element.screenshot({path: `images/${firstTwo}/${rest}.png`});

            data += `${id},${boxes.names.x1},${boxes.names.y1},${boxes.names.x2},${boxes.names.y2},${boxes.pfp.x1},${boxes.pfp.y1},${boxes.pfp.x2},${boxes.pfp.y2}\n`;

            if(i % flushEvery === flushEvery - 1) {
                await flush();
            }

            await page.close();
        });
    }


    const queue = new Queue(functions, 150);

    await queue.awaitDone();
    await flush();

    await writeFile("data.json", data);

    // await page.evaluate(() => {
    //     debugger;
    // });

    await browser.close();
})();
