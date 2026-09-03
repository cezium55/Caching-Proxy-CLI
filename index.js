#!/usr/bin/env node
const axios = require('axios');
const express = require('express');
const app = express();
const fs = require('fs');
const args = process.argv;
const CACHE_FILE = 'cache.json';

function readCache(){
    if(!fs.existsSync(CACHE_FILE)){
        return {};
    }
    const rawText= fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(rawText);
}

function writeCache(cacheData){
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
}

let port = 3000;
let origin = '';
let clearCache = false;

for ( let i = 2; i< args.length; i++){
    if(args[i] === '--port'){
        port = Number(args[i+1]);
    }


    if (args[i] === '--origin'){
    origin = args[i+1];
    }


    if (args[i] === '--clear-cache'){
    clearCache = true;
    }
}

if(clearCache){
    if(fs.existsSync(CACHE_FILE)){
        fs.unlinkSync(CACHE_FILE);
        console.log('cache cleared sucessfully!');

    }else{
        console.log('cache is already empty');
    }process.exit(0);
}

if(origin === ''){
    console.log('error:you must provide an --origin URL!');
    process.exit(1);
}

app.use(async function(req, res){
    const targetUrl = origin + req.url;
    const cache = readCache();

    if(cache[req.url]){
        console.log('serving from cache HIT:',req.url);
        res.setHeader('X-Cache', 'HIT');
        return res.json(cache[req.url]);
    }

    console.log('fetching from origin miss:', targetUrl);
    try{
        const response = await axios.get(targetUrl);
        cache[req.url] = response.data;
        writeCache(cache);
        res.setHeader('X-cache', 'MISS');
        res.json(response.data);

    }catch(error){
        res.status(500).json({error:'failed to fetch the live data from origin server'});
    }
});

app.listen(port, function(){
    console.log('sucess! the proxy server is running on port:'+port);
    console.log('it will forward requests to: '+origin);
});