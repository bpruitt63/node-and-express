const { default: axios } = require('axios');
const fs = require('fs');
const process = require('process');

function cat(path, out){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.error(err);
            process.exit(1);
        }
        handleData(data, out);
    })
}

async function webCat(url, out){
    try{
        const content = await axios.get(url);
        handleData(content.data, out)
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}

let path;
let out;

if (process.argv[2] === '--out'){
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.slice(0, 4) === 'http'){
    webCat(path, out);
} else {
    cat(path, out);
}

function handleData(text, out) {
    if (out) {
        fs.writeFile(out, text, 'utf8', function(err){
            if (err) {
                console.error(err);
                process.exit(1);
            }
        })
    }
    console.log(text);
}