const http = require("http");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require("path");
let fpath = path.resolve('./wzzj.txt');
var fd = fs.openSync(fpath, "r");

fs.readFile(fd, { encoding: "utf8" }, (err, data) => {
    if (err) console.log(err)
    let dom = new JSDOM(data);
    var dds = dom.window.document.querySelectorAll("dd");


    dds.forEach((dd) => {
        //dd.firstElementChild.style.color != "gray"
        if (dd.innerHTML.indexOf("color:Gray") < 0) {
            let title = dd.textContent.replace(/\?/g, "").trim();
            let pagepath = path.resolve('./wzzj/' + title + ".txt")
            fs.openSync(pagepath, "w");
            getPageText(dd.textContent, dd.firstElementChild.href, pagepath);
        }
    })

    console.log("ok");
    // console.log(dds[0].textContent, dds[0].firstElementChild.href);
    // console.log(dds[8].textContent, dds[8].innerHTML.indexOf("color:Gray"));
});


function getPageText(title, url, path) {
    let options = {
        hostname: 'www.ybdu.me',
        port: 80,
        path: '/ybdu169293/' + url,
        method: 'GET',
    };
    console.log(title, JSON.stringify(options));
    let req = http.request(options, function (resp) {
        var hpg = "";
        if (resp.statusCode != 200) console.log('首页打开失败:' + Object.keys(resp.statusCode));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            hpg += chunk;
        });
        resp.on("end", () => {
            let dom = new JSDOM(hpg);
            let div = dom.window.document.querySelector("#content");
            let fstm = fs.createWriteStream(path);
            fstm.write(title + String(div.textContent).trim(), "utf8")
            console.log(title + " " + url + " end!");
        })
    });

    req.setTimeout(30000, () => { req.abort(); });

    req.on('error', function (err) {
        if (err.code == "ECONNRESET")
            console.log('socket端口连接超时。')
        else
            console.log('请求发生错误，err.code:' + err.code);
    });
    req.end();
}