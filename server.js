const express       = require("express");
const axios         = require("axios");
const capitalize    = require("capitalize");
const xpath         = require('xpath')
const dom           = require('xmldom').DOMParser

// Constants
const PORT = 8181;
const URL = " http://mbztx30404.migrosbank.ch/nexus/service/local/lucene/search";

function createVersionTemplate(data){
    var versions = [];
    var doc = new dom().parseFromString(data)
    var nodes = xpath.select("//version", doc)
    var latest = false
    for (i = 0; i < nodes.length; i++) { 
        var currentVersion = nodes[i].firstChild.data
        if(currentVersion.includes("SNAPSHOT") && latest === false){
            currentVersion = "LATEST"
            latest=true
        }
        versions.push(currentVersion)
    }
    
    
    return versions;
}

// App
var app = express();

// call with -> http://localhost/versions?r=releases&g=ch.migrosbank.web&a=valor-search
app.get('/versions', function (req, res){
    // http://mbztx30404.migrosbank.ch/nexus/service/local/artifact/maven/resolve?p=war&r=releases&g=ch.migrosbank.web&a=valor-search&v=LATEST
    // http://mbztx30404.migrosbank.ch/nexus/service/local/lucene/search?p=war&r=releases&g=ch.migrosbank.web&a=valor-search
    var url = URL + "?p=war&r=" + req.query.r +"&g=" + req.query.g + "&a=" + req.query.a;
    axios
        .get(url)
        .then(response => {
            res.json(createVersionTemplate(response.data));
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(PORT);
console.log('Migrosbank nexus-rundeck-version-service running on http://localhost:' + PORT);
