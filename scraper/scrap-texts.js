"use strict";
let _ = require("lodash");
let Promise = require('bluebird');
let writeFile = Promise.promisify(require('fs').writeFile);
let remoteCSVtoJSON = require("./helpers/remote-csv-to-json");

const updateTimestampFile = require("./helpers/update-timestamp-file");

const input = require("./input");
const output = require("./output");

module.exports = function scrapTexts () {
    console.log("Scrap site texts.");
    return remoteCSVtoJSON(input.textsCSV)
        .then(function (texts) {
            console.log("scrapTexts:texts");
            let textsKeyValue = {};
            _.forEach(texts, (text) => {
                textsKeyValue[text.key] = text.ukr;
            });
            const content = JSON.stringify(textsKeyValue);
            return updateTimestampFile(output.texts, content)
                .then(() => writeFile(output.texts, content))
                .then(() => texts);
        });
};
