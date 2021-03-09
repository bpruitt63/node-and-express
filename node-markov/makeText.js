/** Command-line tool to generate Markov text. */

const fs = require('fs');
const markov = require('./markov');
const axios = require('axios');
const process = require('process');

function generate(text){
    let mm = new markov.MarkovMachine(text);
    console.log(mm.makeText())
}

function makeText(path){
    fs.readFile(path, 'utf8', function cb(err, data){
        if(err){
            console.error(err);
            process.exit(1);
        } else {
            generate(data);
        }
    })
}

async function makeURLText(url){
    let res;
    try{
        res = await axios.get(url);
    } catch (err){
        console.error(err);
        process.exit(1);
    }
    generate(res.data)
}

let [method, path] = process.argv.slice(2);
if (method === 'file'){
    makeText(path);
} 
else if (method === 'url'){
    makeURLText(path);
}
else {
    console.error('Unknown method');
    process.exit(1);
}