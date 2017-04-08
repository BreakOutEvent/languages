var CSV = require('csv-string');
var fs = require('fs');

var filename = "translations.csv"; // TODO

function language(rows, index) {
    return rows.map(function(x) {
        return {
            key: x[0],
            string: x[index],
        };
    });
}

function addKey(languageObject, key, string) {
    var parts = key.split(".");
    var part = parts[0];
    if (parts.length == 1) {
        languageObject[part] = string;
    } else {
        if (!languageObject[part]) {
            languageObject[part] = {};
        }
        addKey(languageObject[part], parts.splice(1).join("."), string);
    }
}

function createFile(object) {
    return "module.exports = " + JSON.stringify(object, 4,  4) + ";";
}

function exportStrings(object, language) {
    var filename = "translations." + language + ".js";
    var file = createFile(object);
    fs.writeFileSync(filename, file);
}

function exportStringInFile(filename, languages) {
    var file = fs.readFileSync(filename, { encoding: "utf8" });
    var rows = CSV.parse(file).splice(1).filter(function(row) {
        return row[1] == "ja" && row[2] == "ja";
    });
    for (var i = 0; i < languages.length; i++) {
        var identifier = languages[i].identifier;
        var index = languages[i].index;
        var strings = language(rows, index);
        var languageObject = {};
        for (var j = 0; j < strings.length; j++) {
            addKey(languageObject, strings[j].key, strings[j].string);
        }
        exportStrings(languageObject, identifier);
    }
}

exportStringInFile(filename, [
    {
        identifier: "en",
        index: 4,
    },{
        identifier: "de",
        index: 3,
    }
]);
