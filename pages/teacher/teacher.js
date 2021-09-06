const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // get the database information
    let text = fs.readFileSync("./pages/teacher/teacher.html", "utf-8"); // get the html
    text = text.replace('"replace_seats"', JSON.stringify(json)); // insert the database into the html
    res.writeHead(200, 'text/html') 
    res.end(text); // return html
}