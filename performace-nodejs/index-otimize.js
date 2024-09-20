const fs = require("fs");
const SEED_PATH = "./seed.txt";
const OUT_PATH = './big-file-buffer-otimize.txt';
const { Readable } = require("stream");

const seed = fs.readFileSync(SEED_PATH);
const targetSize = Math.pow(1024, 3);

const CHUNK_SIZE = 1024 * 1024;
let totalBytesPushed = 0;

console.time("generating file");
const generate = new Readable({
    read() {
        while (totalBytesPushed < targetSize) {
            let remainingBytes = targetSize - totalBytesPushed;
            let bytesToPush = Math.min(CHUNK_SIZE, remainingBytes);
            let chunk = Buffer.alloc(bytesToPush);
            let offset = 0;
            while (offset < bytesToPush) {
                const copyLength = Math.min(seed.length, bytesToPush - offset);
                seed.copy(chunk, offset, 0, copyLength);
                offset += copyLength;
            }
            this.push(chunk);
            totalBytesPushed += bytesToPush;
        }
        this.push(null);
    }
});
const outFile = fs.createWriteStream(OUT_PATH);
generate.pipe(outFile);

outFile.on("finish", () => {
    console.timeEnd("generating file");
});
