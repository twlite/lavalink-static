#!/usr/bin/env node

const lavadl = require("./index.js");
const dlPathRaw = process.argv.find(x => x.startsWith("--path="));
const dlChannelRaw = process.argv.find(x => x.startsWith("--channel="));

if (process.argv.includes("--help")) {
    console.log(`Lavalink Static\n\nExample: lavalink-static --channel=latest --path=./lavalink`);
} else {
    const config = {
        channel: dlChannelRaw && dlChannelRaw.split("=")[1] || "latest",
        outPath: dlPathRaw && dlPathRaw.split("=")[1] || `${__dirname}/downloads`
    };

    let startStamp;

    try {
        lavadl({
            ...config,
            onStart: (url) => {
                const startDate = new Date();
                console.log(`[${startDate.toLocaleString()}] Downloading Lavalink from ${url}...`);
                startStamp = startDate.getTime();
            },
            onFinish: (path) => {
                const endDate = new Date();
                console.log(`[${endDate.toLocaleString()}] Successfully downloaded Lavalink at ${path}!`);
                console.log(`Took ${((endDate.getTime() - startStamp) / 1000).toFixed(2) || "0"} seconds.`);
            },
            onError: (err) => {
                console.log(`[${new Date().toLocaleString()}] Download failed!\n${err.message || err}`);
            }
        });
    } catch (err) {
        console.log(`[${new Date().toLocaleString()}] Download failed!\n${err.message || err}`);
    }
}