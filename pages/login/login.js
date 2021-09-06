const fs = require("fs");

module.exports = {execute};

function execute (data, res) {
    if (data) {

        pass = data.replace("Password=", "");
        if (pass ===     "worthington") {
            let text = fs.readFileSync("./pages/login/forward.html", "utf-8"); // get the html
            res.writeHead(200, 'text/html') 
            res.end(text); // return html        
        }
        else {  
            let text = fs.readFileSync("./pages/login/login.html", "utf-8"); // get the html
            res.writeHead(200, 'text/html') 
            res.end(text); // return html
        }
    }
    else {
        let text = fs.readFileSync("./pages/login/login.html", "utf-8"); // get the html
        res.writeHead(200, 'text/html') 
        res.end(text); // return html
    }
}