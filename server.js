var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');

var port = process.env.PORT || 3001;
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

var allowedOrigins = [
    'http://localhost:3001',
    'https://prg-demo.herokuapp.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(cors({
    exposedHeaders: ['Authorization'],
}));

var Service = require('./service');
app.get('/api/v1/auth/login', async (req, res) => {
    const query = req.query || {};
    Service.setLangKey(query.language);
    result = await Service.getPageInit('login');
    res.send(result);
});

app.post('/api/v1/auth/login', (req, res) => {
    res.send({
        token: Service.getToken()
    });
});

app.get('/api/v1/menu/ADMINMENU', (req, res) => {
    res.send(Service.getMenu());
});

app.get('/api/v1/searchHelp/:shkey', async (req, res) => {
    const key = req.params.shkey;
    result = await Service.getSearchHelp(key);
    res.send(result);
});

app.get('/api/v1/menu/ADMINMENU', (req, res) => {
    res.send(Service.getMenu());
});

app.get('/api/v1/rec/receive/listRcv', async (req, res) => {
    result = await Service.getAllRCV("listRcv");
    res.send(result);
});

app.post('/api/v1/rec/receive/save', async (req, res) => {
    result = await Service.changeAll(req.body);
    res.send(result);
});

app.post('/api/v1/rec/receive/saveRcv', async (req, res) => {
    result = await Service.changeRCV(req.body, "listRcv");
    res.send(result);
});

app.delete('/api/v1/rec/receive/deleteRcv/:key', async (req, res) => {
    const key = req.params.key;
    result = await Service.deleteRCV(key, "listRcv");
    res.send(result);
})

app.get('/api/v1/rec/receive/listRcvDetail', async (req, res) => {
    result = await Service.getAllRCV("listRcvDetail");
    res.send(result);
});

app.post('/api/v1/rec/receive/saveRcvDetail', async (req, res) => {
    result = await Service.changeRCV(req.body, "listRcvDetail");
    res.send(result);
});

app.delete('/api/v1/rec/receive/deleteRcvDetail/:key', async (req, res) => {
    const key = req.params.key;
    result = await Service.deleteRCV(key, "listRcvDetail");
    res.send(result);
})

app.listen(port, () => {
    console.log(`dummy app listening on port !`);
});