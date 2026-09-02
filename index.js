const axios = require('axios');
const express = require('express');
const app = express();

const args = process.argv;
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
    console.log('clearing the cache../');
    process.exit(0);
}

if(origin === ''){
    console.log('error:you must provide an --origin URL!');
    process.exit(1);
}

app.use(async function(req, res){
    const targetUrl = origin + req.url;
    console.log('forwarding request to: ',targetUrl);
        try{
            const response = await axios.get(targetUrl);
            res.setHeader('X-Cache', 'MISS');
            res.json(response.data);
        }catch(error){
            res.status(500).json({error: 'failed to fetch data from the origin server'});
        }

});

app.listen(port, function(){
    console.log('sucess! the proxy server is running on port:'+port);
    console.log('it will forward requests to: '+origin);
})