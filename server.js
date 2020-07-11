var express = require('express');
var port = process.env.PORT || 3001;
var app = express();
app.get('/test', function (req, res) {
 res.send(JSON.stringify({ Hello: 'World'}));
});
app.listen(port, function () {
 console.log(`dummy app listening on port !`);
});