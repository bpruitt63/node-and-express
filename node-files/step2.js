const { default: axios } = require('axios');
const fs = require('fs');
const process = require('process');

function cat(path){
    fs.readFile(path, 'utf8', function(err, data){
        if (err){
            console.error(err);
            process.exit(1);
        }
        console.log(data);
    })
}

async function webCat(url){
    try{
        const content = await axios.get(url);
        console.log(content)
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}

const path = process.argv[2];

if (path.slice(0, 4) === 'http'){
    webCat(path);
} else {
    cat(path);
}