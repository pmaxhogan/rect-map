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
    await makeDirectoyIfNotExists("images/training");
    await makeDirectoyIfNotExists("images/testing");

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


    const functions = [];
    for(let i = 0; i < 1000; i++) {
        functions.push(async () => {
            const id = uuidv4();
            const base = `images/${i % 10 === 0 ? "testing" : "training"}`;

            const page = await browser.newPage();

            await page.goto(`${path.join(path.dirname(import.meta.url), "gen.html")}`);

            await page.waitForNetworkIdle({timeout: 3000});
            const element = await page.$("#main");

            const boxes = await page.evaluate(() => getBoundingBoxes());


            await element.screenshot({path: `${base}/${id}.jpeg`});

            const xml = `
            <annotation>
                <folder>images</folder>
                <filename>${id}.jpeg</filename>
                <path>images/${id}.jpeg</path>
                <source>
                    <database>Unknown</database>
                </source>
                <size>
                    <width>600</width>
                    <height>450</height>
                    <depth>3</depth>
                </size>
                <segmented>0</segmented>
                <object>
                    <name>names</name>
                    <pose>Unspecified</pose>
                    <truncated>0</truncated>
                    <difficult>0</difficult>
                    <bndbox>
                        <xmin>${boxes.names.x1}</xmin>
                        <ymin>${boxes.names.y1}</ymin>
                        <xmax>${boxes.names.x2}</xmax>
                        <ymax>${boxes.names.y2}</ymax>
                    </bndbox>
                </object>
                <object>
                    <name>pfp</name>
                    <pose>Unspecified</pose>
                    <truncated>0</truncated>
                    <difficult>0</difficult>
                    <bndbox>
                        <xmin>${boxes.pfp.x1}</xmin>
                        <ymin>${boxes.pfp.y1}</ymin>
                        <xmax>${boxes.pfp.x2}</xmax>
                        <ymax>${boxes.pfp.y2}</ymax>
                    </bndbox>
                </object>
            </annotation>
            `;

            await writeFile(`${base}/${id}.xml`, xml);



            await page.close();
        });
    }


    const queue = new Queue(functions, 32);

    await queue.awaitDone();

    // await page.evaluate(() => {
    //     debugger;
    // });

    await browser.close();
})();
