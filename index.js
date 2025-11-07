// index.js
// where your node app starts

// Functions
// -> check for valid date string
function isValidDateString(dateStr) {
    let dateObj = new Date(dateStr);
    return !isNaN(dateObj); // Returns true for valid dates, false for "Invalid Date"
}
// -> check for integer value (unix timestamp validation)
function isStringAnInteger(str) {
const num = Number(str); // Or parseInt(str, 10) for base 10
return Number.isInteger(num);
}

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// 2. A request to /api/:date? with a valid date should return a JSON object with a unix key that is a Unix timestamp of the input date 
// in milliseconds (as type Number)
// 3. A request to /api/:date? with a valid date should return a JSON object with a utc key that is a string of the input date in the format:
// Thu, 01 Jan 1970 00:00:00 GMT
// 4. A request to /api/1451001600000 should return { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
app.get("/api/:date?", function (req, res) {    // "?" makes the date parameter optional
  let unix_int;
  let utc_time;
  let returned_json;
  let valid_input;
  // 7. An empty date parameter should return the current time in a JSON object with a unix key
  // 8. An empty date parameter should return the current time in a JSON object with a utc key
  //console.log('req.params.date is ',req.params.date);
  if (!req.params.date || req.params.date === '') {
    valid_input = true;
    utc_time = new Date();
    unix_int = utc_time.getTime();

  // Check for millisecond timestamp eg 1451001600000
  } else if (isStringAnInteger(req.params.date)) {
    valid_input = true;
    unix_int = parseInt(req.params.date);
    utc_time = new Date(unix_int);

  // 5. Your project can handle dates that can be successfully parsed by new Date(date_string)
  // Check for date type eg 2015-12-256
  } else if (isValidDateString(req.params.date)) { 
    valid_input = true;
    utc_time = new Date(req.params.date);
    unix_int = utc_time.getTime();

  // 6. If the input date string is invalid, the API returns an object having the structure { error : "Invalid Date" }
  // Invalid input
  } else {
    valid_input = false;
  }
  // Return json object
  if (valid_input) {
    returned_json = {"unix": unix_int, "utc": utc_time.toUTCString()};
  } else {
    returned_json = { "error": "Invalid Date" }
  }
  res.json(returned_json);
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
