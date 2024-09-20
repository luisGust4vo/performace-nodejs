const fs = require("fs");
const SEED_PATH = "./seed.txt";
const OUT_PATH = './big-file-buffer-ot-bff.txt';
const { Readable } = require("stream");

const seed = fs.readFileSync(SEED_PATH);
const targetSize = Math.pow(1024, 3);
const chunkSize = 1024 * 1024;
let totalBytesWritten = 0;

console.time("generating file");

const generate = new Readable({
    read() {
        while (totalBytesWritten < targetSize) {
            const remainingBytes = targetSize - totalBytesWritten;
            const bytesToPush = Math.min(chunkSize, remainingBytes);
            const chunk = Buffer.alloc(bytesToPush);
            for (let i = 0; i < bytesToPush; i += seed.length) {
                seed.copy(chunk, i);
            }
            this.push(chunk);
            totalBytesWritten += bytesToPush;
        }
        this.push(null); 
    }
});

const outFile = fs.createWriteStream(OUT_PATH);
generate.pipe(outFile);

outFile.on("finish", () => {
    console.timeEnd("generating file");
});
