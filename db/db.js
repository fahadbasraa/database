import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";
const connectdb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB}/${process.env.DB_NAME}`);
        console.log(`Mongo is connected`);
    } catch (error){
        console.log("ERROR OCCURED IN DB CONNECTIVITY");
        process.exit(1);
    }
}
export default connectdb

