import puppeteer from "puppeteer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import {readFile, writeFile, mkdir} from "fs/promises";

async function makeDirectoyIfNotExists(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
    } catch (err) {
        if(e.code !== "ENOENT") {
            throw e;
        }
    }
}

(async () => {
    await makeDirectoyIfNotExists("images");

    let data = [];
    try {
        data = JSON.parse(await readFile("data.json", "utf8"))
    } catch (e) {
        if(e.code !== "ENOENT") {
            throw e;
        }
    }

    const browser = await puppeteer.launch({
        // devtools: true,
    });

    const proms = [];
    for(let i = 0; i < 500; i++) {
        proms.push((async () => {
            const id = uuidv4()
            const firstTwo = id.substring(0, 2);
            const rest = id.substring(2);

            const page = await browser.newPage();

            await page.goto(`${path.join(path.dirname(import.meta.url), "gen.html")}`);

            await page.waitForNetworkIdle({timeout: 3000});
            const element = await page.$("#main");

            const boxes = await page.evaluate(() => getBoundingBoxes());
            boxes.id = id;

            data.push(boxes);

            await makeDirectoyIfNotExists(`images/${firstTwo}`);
            await element.screenshot({path: `images/${firstTwo}/${rest}.png`});
        })());
    }

    await Promise.all(proms);

    await writeFile("data.json", JSON.stringify(data));

    // await page.evaluate(() => {
    //     debugger;
    // });

    await browser.close();
})();
