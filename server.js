const express = require("express");
const axios = require("axios");
const capitalize = require("capitalize");


// Constants
const PORT = 80;
const URL = "https://build.revendex.com/nexus/service/siesta/rest/beta/search/assets?repository=docker-internal";

function createPortatinerTemplate(items){
    var templates = [];
    for (var i = 0; i < items.length; i++) {
        var pathElements = items[i].path.split("/");

        var repository = pathElements[1];
        var image = pathElements[2];
        var titleElements = image.split("-");
        
        var product = capitalize(titleElements[0]);
        var category = capitalize(titleElements[1]);
        var title = capitalize(titleElements[2]);
        var version = pathElements[4];

        templates.push(
            {
                "type": "container",
                "title": title + " " + category + " (" + version + ")",
                "description": "Revendex Primedex " + title + " " + category,
                "image": repository + "/" + image + ":" + version,
                "registry": "docker.revendex.com",
                "network": "host",
                "restart_policy": "unless-stopped",
                "platform": "linux"
                
            }
        );
    }
    return templates;
}

// App
var app = express();

app.get('/revendex/template.json', function (req, res){
    axios
        .get(URL)
        .then(response => {
            console.log(response.data);
            res.json(createPortatinerTemplate(response.data.items));
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(PORT);
console.log('Primedex templates running on http://localhost:' + PORT);
