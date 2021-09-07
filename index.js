const http = require('http');
const fs = require('fs');
const {registerName, changeAmount, getAmount, setSeat, deleteSeat} = require("./functions/database");
const hostname = '127.0.0.1'
const port = process.env.PORT || 5000; // define port 

const server = http.createServer(async (req, res) => {

    if (req.method == 'POST') { // if data is posted with jQuery
        let body = '';
        req.on('data', function (data) {
            let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
            body += data;
            data = JSON.parse(body); // parse the data
            console.log(data)
            switch (data["action"]) {  // check which action it is
                case "seat":
                    for (seat in data["data"]) {
                        setSeat(data["period"], data["data"][seat], seat);
                    }
                    break;
                case "give":
                    for (name of data["names"]) {
                        changeAmount(data["period"], name, true, data["amount"])
                        stats["total"] += data["amount"];
                        stats["amount"] += data["amount"];
                        stats["periods"][data["period"]] += data["amount"];
                    }
                    break;
                case "purchase":
                    for (name of data["names"]) {
                        changeAmount(data["period"], name, false, data["amount"])
                        stats["amount"] -= data["amount"];
                        stats["periods"][data["period"]] -= data["amount"];
                    }
                    break;
                case "delete": 
                    deleteSeat(data["period"], data["data"]);
                    break;

            }
        
            fs.writeFileSync("./stats.json", JSON.stringify(stats, null, 4));
        });
        

    }

    res.statusCode = 200;

    url = req.url.split("?")[0]; // devide the data
    data = req.url.split("?")[1];

    console.log(url, data);

    pass = ""

    if (url.includes("/pages")) { // check for which page, get the function to send the page, then execute
        if (url.includes("/teacher")) {
            if (data) {
                pass = data.replace("Password=", "");
            }
            if (parseCookies(req)["Password"] === 'worthington' || pass === "worthington") {
                if (pass === "worthington") {
                    res.setHeader('Set-Cookie','Password=worthington');
                }
                fn = require('./pages/teacher/teacher');
                fn.execute(data, res);
            }
            else {
                let txt = fs.readFileSync("./pages/send to login/forward.html", "utf-8")
                res.writeHead(200, 'text/html') 
                res.end(txt)
            }
        }
        else if (url.includes("/student" || url === "/")) {
            fn = require("./pages/student/student");
            fn.execute(data, res);
        }
        else if (url.includes("/login")) {
            fn = require("./pages/login/login");
            fn.execute(data, res);
        }

    }
    else if (url.includes('/css')) { // if its css then just return the requested file at the requested path
        data = fs.readFileSync(`.${url}`);
        if (url.includes('/css/css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        else if (url.includes('/css/images')) {
            res.setHeader('Content-Type', 'image/png');
        }
        else if (url.includes('/javascript/')) {
            res.setHeader('Content-Type', 'text/javascript')
        }
        else {

        }
        res.end(data);

    }
    else {
        fn = require("./pages/student/student");
        fn.execute(data, res);
    }
});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
