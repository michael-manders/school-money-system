const fs = require("fs");
module.exports = {
    registerName, changeAmount, getAmount, setSeat, deleteSeat
};


function registerName(period, name, seat) {
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // opens JSON file
    period = period.toString();
    seat = seat.toString();
    if (!json[period] || json[period][name] || !period.length >= 1 || !name > 1) return false; // checks cases that would error and return false standing for an error
    json[period][name] = {"value" : 0, "seat": parseInt(seat)}; // updates json
    fs.writeFileSync("./database.json", JSON.stringify(json, null, 4)); // write the file back
    return true // success status code
};


function changeAmount(period, name, add, amount) { 
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // opens JSON file
    period = period.toString();
    if (!json[period] || !json[period][name] || !period.length == 1 || !name > 1 || !amount) return false; // checks cases that would error and return 1 standing for an error;
    json[period][name]["value"] = (add) ? (json[period][name]["value"] + amount) : (json[period][name]["value"] - amount); // if add is true, add the amount to the name, if false, then subtract the amount
    fs.writeFileSync("./database.json", JSON.stringify(json, null, 4)); // write the file back
    return true // success status code
};

function getAmount(period, name) {
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // opens JSON file
    if (json[period][name]) {
        return json[period][name]["value"];
    };
};

function setSeat(period, name, seat) {
    period = period.toString();
    seat = seat.toString();
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // opens JSON file
    let seated = [];

    for (person in json[period]) { // checks if anyone else is in the selected seat
        personObj = json[period][person];
        if (!(personObj["seat"])) continue
        if (personObj["seat"].toString() === seat) seated.push(person);
    };

    for (person of seated) { // sets all the people found in the last for loop to not having a seat
        json[period][seated]["seat"] = null;
    };

    if (!json[period][name]) json[period][name] = {"value": 0, "seat": 0}; // if the name is not there, then add the person

    json[period][name]["seat"] = parseInt(seat); // sets the selected person's seat to the desired value

    fs.writeFileSync("./database.json", JSON.stringify(json, null, 4));

};

function deleteSeat (period, name) {
    period = period.toString();
    const json = JSON.parse(fs.readFileSync("./database.json", "utf-8")); // opens JSON file

    json[period][name]["seat"] = null; // deletes the seat

    fs.writeFileSync("./database.json", JSON.stringify(json, null, 4));
}