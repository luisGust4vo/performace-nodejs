const fs = require("fs");
const SEED_PATH = "./seed.txt";
const OUT_PATH = './big-file-buffer.txt';
const { Readable } = require("stream");

const seed = fs.readFileSync(SEED_PATH);
const targetSize = Math.pow(1024, 3);
const iterations = Math.ceil(targetSize / seed.length);

console.time("generating file");

const generate = new Readable({
    read() {
        for (let index = 0; index < iterations; index++) {
            this.push(seed);
        }
        this.push(null);
    }
});



const outFile = fs.createWriteStream(OUT_PATH);
generate.pipe(outFile);

outFile.on("finish", () => {
    console.timeEnd("generating file");
});




