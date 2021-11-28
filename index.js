const DL_LINKS = {
    latest: `https://ci.fredboat.com/repository/download/Lavalink_Build/.lastSuccessful/Lavalink.jar?guest=1&branch=refs/heads/master`,
    dev: `https://ci.fredboat.com/repository/download/Lavalink_Build/.lastSuccessful/Lavalink.jar?guest=1&branch=refs/heads/dev`
};
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");

function createDownloadStream(url, onStart, cb) {
    if (onStart) onStart(url);
    else if (!onStart) console.log(`Downloading Lavalink from ${url}`);

    https.get(url, res => {
        if ([301, 302].includes(res.statusCode)) return createDownloadStream(res.headers.location, cb);
        cb(res);
    });
}

module.exports = function lavadl({
    channel = "latest",
    outPath = `${__dirname}/downloads`,
    onError = null,
    onFinish = null,
    onStart = null
}) {
    if (!channel || !DL_LINKS[channel]) throw new Error("unsupported channel");
    createDownloadStream(DL_LINKS[channel], onStart, incomingMessage => {
        if (!fs.existsSync(outPath) && typeof outPath === "string") fs.mkdirSync(outPath, { recursive: true });
        const filePath = path.resolve(`${outPath}/Lavalink${channel === "dev" ? "-dev" : ""}.jar`);
        const writeStream = fs.createWriteStream(filePath);
        incomingMessage.pipe(writeStream)
            .on("error", (err) => {
                if (onError) return onError(err);
                console.error(`Failed to download lavalink:\n${err}`);
            })
            .on("finish", () => {
                try {
                    fs.writeFileSync(`${__dirname}/metadata.json`, JSON.stringify({
                        path: filePath,
                        channel,
                        name: `Lavalink${channel === "dev" ? "-dev" : ""}.jar`
                    }));
                } catch {}
                if (onFinish) return onFinish(filePath);
                console.log(`Successfully downloaded Lavalink jar at ${filePath}`);
            });
    });
}

module.exports.getPath = () => {
    try {
        const metadata = JSON.parse(fs.readFileSync(`${__dirname}/metadata.json`));
        const obj = {
            fileName: metadata.name,
            path: metadata.path,
            channel: metadata.channel
        };
        if (!fs.existsSync(obj.path)) return null;
        return obj;
    } catch {
        return null;
    }
};