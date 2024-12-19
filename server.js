/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const mongosse = require("mongoose");
const path = require("path");
const  cors = require('cors')
// eslint-disable-next-line node/no-extraneous-require
const  bodyParser = require('body-parser');

const router = require('./routes');

dotenv.config({ path: ".env" });


mongosse.set('strictQuery', true);
mongosse.connect(process.env.DB_URI).then((conn) => {
  console.log(`Database connect ${conn.connection.host} `);
});

const app = express();

//use this to get IP user
app.set("trust proxy", true);

app.use(express.json());
app.use('/uploads',express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(cors())

//all routes in file => routers/index.js
router(app);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true , parameterLimit: 100000}));




const port = process.env.PORT;

app.listen(port, () => {
  console.log("srver Run");
});
