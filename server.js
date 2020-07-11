var express = require('express');
var bodyParser = require('body-parser')
var port = process.env.PORT || 3001;
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())


var Service = require('./service');
app.get('/auth/login', async (req, res) => {
    const query = req.query || {};
    Service.setLangKey(query.language);
    result = await Service.getPageInit('login');
    res.send(result);
});

app.post('/auth/login', (req, res) => {
    res.send({
        token: Service.getToken()
    });
});

app.get('/menu/ADMINMENU', (req, res) => {
    res.send(Service.getMenu());
});

app.get('/searchHelp/:shkey', async (req, res) => {
    const key = req.params.shkey;
    result = await Service.getSearchHelp(key);
    res.send(result);
});

app.get('/menu/ADMINMENU', (req, res) => {
    res.send(Service.getMenu());
});

app.get('/rec/receive/listRcv', async (req, res) => {
    result = await Service.getAllRCV("listRcv");
    res.send(result);
});

app.post('/rec/receive/save', async (req, res) => {
    result = await Service.changeAll(req.body);
    res.send(result);
});

app.post('/rec/receive/saveRcv', async (req, res) => {
    result = await Service.changeRCV(req.body, "listRcv");
    res.send(result);
});

app.delete('/rec/receive/deleteRcv/:key', async (req, res) => {
    const key = req.params.key;
    result = await Service.deleteRCV(key, "listRcv");
    res.send(result);
})

app.get('/rec/receive/listRcvDetail', async (req, res) => {
    result = await Service.getAllRCV("listRcvDetail");
    res.send(result);
});

app.post('/rec/receive/saveRcvDetail', async (req, res) => {
    result = await Service.changeRCV(req.body, "listRcvDetail");
    res.send(result);
});

app.delete('/rec/receive/deleteRcvDetail/:key', async (req, res) => {
    const key = req.params.key;
    result = await Service.deleteRCV(key, "listRcvDetail");
    res.send(result);
})

app.listen(port, () => {
    console.log(`dummy app listening on port !`);
});