const http = require("http");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let options = {
    hostname: 'www.ybdu.me',
    port: 80,
    path: '/ybdu169293/8528050.html',
    method: 'GET',
};
//"http://www.ybdu.me/ybdu169293/8528050.html"

var req = http.request(options, function (resp) {
    var hpg = "";
    if (resp.statusCode != 200) console.log('首页打开失败:' + Object.keys(resp.statusCode));
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
        hpg += chunk;
    });
    resp.on("end", () => {
        let dom = new JSDOM(hpg);
        var div = dom.window.document.querySelector("#content");
        console.log(div.textContent);
    })
});

req.setTimeout(10000, () => { req.abort(); });

req.on('error', function (err) {
    if (err.code == "ECONNRESET")
        console.log('socket端口连接超时。')
    else
        console.log('请求发生错误，err.code:' + err.code);
});
req.end();
