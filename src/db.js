import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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