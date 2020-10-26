const fs = require('fs');
const path = require("path");
const http = require("http");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let options = {
    hostname: 'www.ybdu.me',
    port: 80,
    path: '/ybdu169293/',
    method: 'GET',
};

const fpath = path.resolve('./wzzj.txt');
const fstm = fs.createWriteStream(fpath);

var req = http.request(options, function (resp) {
    if (resp.statusCode != 200) console.log('首页打开失败:' + Object.keys(resp.statusCode));
    resp.setEncoding('utf8');
    resp.on('data', function (chunk) {
        fstm.write(chunk, 'utf8');
        //hpg += chunk;
    });
});

req.setTimeout(5000, function () {
    req.abort();
});

req.on('error', function (err) {
    if (err.code == "ECONNRESET")
        console.log('socket端口连接超时。')
    else
        console.log('请求发生错误，err.code:' + err.code);

});
req.end();
