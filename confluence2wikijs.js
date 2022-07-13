//requiring path and fs modules
const path = require('path');
const fs = require('fs');
var HTMLParser = require('node-html-parser');

//const directoryPath = process.argv[2];
//const outDirectoryPath = process.argv[3];

convertDirectory(process.argv[2], process.argv[3]);

function convertDirectory(directoryPath, outDirectoryPath) {
    fs.mkdirSync(outDirectoryPath);

    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        //listing all files using forEach
        files.forEach(function (file) {
            console.log("\nReading: " + file);
            if (file.endsWith(".html")) {
                fs.readFile(path.join(directoryPath, file), "utf8", function(err, data) {
                    parsedHtml = HTMLParser.parse(data)

                    page_title = parsedHtml.querySelector("head").querySelector("title").rawText
                    page_title = page_title.substr(page_title.search(" : ") + 3)

                    page_data = "<!--\ntitle: " + page_title + "\n-->"
                    page_data = page_data + parsedHtml.querySelector("#main-content").innerHTML;

                    console.log("ConvertingHTML file to Wiki: " + file);
                    fs.writeFileSync(path.join(outDirectoryPath, file + ".html"), page_data)
                });
            }
            else if (fs.lstatSync(path.join(directoryPath, file)).isDirectory()) {
                console.log("Scaning directory: " + file);
                convertDirectory(path.join(directoryPath, file), path.join(outDirectoryPath, file))
            }
            else {
                console.log("Copying non HTML file: " + file);
                fs.copyFileSync(path.join(directoryPath, file), path.join(outDirectoryPath, file))
            }
        });
    });
}