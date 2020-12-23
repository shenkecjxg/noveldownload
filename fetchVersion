const fetch = require("node-fetch");
const fs = require('fs');
const path = require("path");
const { JSDOM } = require("jsdom");;


const baseUrl = 'http://www.biquge.info/55_55996/';
const fileName = '地煞七十二变';

let fpath = path.resolve(`./${fileName}.txt`);
let fstm = fs.createWriteStream(fpath);

main(baseUrl);

async function main(rootUrl, options) {
    options = options || {};
    let dds, tryMaxNum = options.trynumber || 10;
    try {
        dds = await loadHome(rootUrl);
    } catch (e) {
        console.log('loadHomePage Error:' + typeof e === 'object' ? JSON.stringify(e) : String(e));
    }

    for (var i = 0; i < dds.length; i++) {
        let p, n = 1, cp = dds[i].firstChild;
        console.log(cp.textContent + 'loading...')
        fstm.write(String(cp.textContent).trim(), "utf8");
        while (!p && n <= tryMaxNum) {
            try {
                p = await getChapter(rootUrl + cp.href);
                fstm.write(String(p.textContent).trim(), "utf8");
                console.log('OK!');
            } catch (err) {
                console.log(err);
                console.log(`${cp.textContent}:error ${n} repeat`);
                n++
            }
        }
        if (n == tryMaxNum && !p) {
            console.log(cp.textContent, 'error');
            break;
        };
    }
    fstm.close();
    console.log('All End!');
}


function loadHome(url, selector) {
    selector = selector || '#list>dl>dd';
    return new Promise((resolve, reject) => {
        _fetch(url).then(res => {
            if (res.ok)
                return Promise.race([timeoutPromise(), res.text()]);
            else
                reject('Fetch Error:' + url);
        }).then(body => {
            let html = new JSDOM(body);
            let dds = html.window.document.querySelectorAll(selector);
            if (dds.length)
                resolve(dds);
            else
                reject('Home Notfound:' + selector);
        }).catch(err => reject(err));
    })
}



function getChapter(url, selector) {
    selector = selector || '#content';
    return new Promise((resolve, reject) => {
        _fetch(url).then(res => {
            if (res.ok)
                return Promise.race([timeoutPromise(), res.text()]);
            else
                reject('Fetch Error:' + url);
        }).then(body => {
            let html = new JSDOM(body);
            let dom = html.window.document.querySelectorAll(selector);
            if (dom[0])
                resolve(dom[0]);
            else
                reject('Chapter Notfound:' + selector);
        }).catch(err => reject(err));
    })
}


function _fetch(url, timeout) {
    timeout = timeout || 20000;
    const f = fetch(url);
    const t = timeoutPromise(timeout);
    return Promise.race([f, t]);
}

function timeoutPromise(t) {
    t = t || 30000;
    return new Promise((resolve, reject) => {
        setTimeout(reject, t, 'timeout:' + t);
    });
}
