const fs = require('fs');
const path = require("path");

const tpath = path.resolve('./wzzjall.txt');
const fstm = fs.createWriteStream(tpath);

let files = fs.readdirSync(path.resolve('./wzzj/'))
var dic = {};

files.forEach((name) => {
    if (!dic.hasOwnProperty(name))
        dic[name] = fs.readFileSync(path.resolve("./wzzj/" + name), "utf8");
})

for (let i = 1; i < files.length; i++) {
    var title = `第${i}章 `;
    for (let n in dic) {
        if (n.indexOf(title) >= 0) {
            let ns = n.split(".");
            fstm.write(ns[0] + "\n" + dic[n].replace(ns[0], "").trim() + "\n", "utf8")
            console.log(n);
            break;
        }
    }
}

console.log("End")