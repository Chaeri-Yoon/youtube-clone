import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
/*
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOATLAS_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(process.env.DB_NAME).collection("users");
  client.close();
});
*/
mongoose.connect(process.env.MONGOATLAS_URL, 
    {
    useNewUrlParser: true,
    useFindAndModify: false
    }
);

const db = mongoose.connection;
const handleOpen = () => console.log("✔ Connected to DB");
const handleError = () => console.log("❌ Error on DB Connection");

db.once("open", handleOpen);
db.on("error", handleError);