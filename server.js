
require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();

var {empresaModule} = require('./componentes/empresa');
var {vehiculoModule} = require('./componentes/vehiculo');
var {conductorModule} = require('./componentes/conductores');

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
    next();
});


app.get('/', (req, res) => {
    res.send('Welcome to learn backend with express!');
});
app.listen(process.env.port, () => {
    empresaModule(router);
    vehiculoModule(router);
    conductorModule(router);
    console.log('Example app listening on port '+process.env.port+'!');
});

app.use('/api', router);