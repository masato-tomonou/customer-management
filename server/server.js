import express, { response } from "express";
// import axios from "axios";
// import xml2js from "xml2js";
// import cors from "cors";
// const path = require("path");
const app = express();
// app.use(cors());
const port = 8000;
app.listen(port, () => {
  console.log(`port ${port} :サーバー起動中`);
});
