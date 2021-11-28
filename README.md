# Lavalink Static

Downloads **[`Lavalink.jar`](https://github.com/freyacodes/Lavalink)**

# Download Channels
- latest
- dev

# Example

## CLI

```sh
$ lavalink-static --channel=dev --path=./downloads
```

Downloads lavalink dev build to the given path.

## Regular

```js
const lavadl = require("lavalink-static");

let start;
lavadl({
    channel: "dev",
    outPath: `${__dirname}/downloads`,
    onStart: (url) => {
        start = Date.now();
        console.log(`Downloading lavalink from ${url}`);
    },
    onFinish: (path) => {
        console.log(`Took ${Date.now() - start}ms\nPath: ${path}`);
    },
    onError: console.error
});
```

## Get binary path

```js
const downloaded = lavadl.getPath();
if (!downloaded) console.log("No downloads found!");
else console.log(downloaded.path); // ex: { fileName: "Lavalink-dev.jar", path: "...", channel: "dev" }
```