import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoute from "./routes/web";
import * as connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

let app = express();

// Add headers before the routes are defined
// destructor middleware for server
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

app.use(
  cors({
    origin: process.env.URL_REACT,
    credentials: true,
  })
);
//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngine(app);
initWebRoute(app);

connectDB.connectDB();

let port = process.env.PORT || 8000;
//nếu port undefined thì sẽ lấy giá trị là 8000

app.listen(port, () => {
  //callback
  console.log(`Backend NodeJS is running on the port: ${port}`);
});
