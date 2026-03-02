import mongoose  from "mongoose";
import { ENV } from "./env.js";

const connectDB=async()=>{
    try{
          const conn=await mongoose.connect(ENV.MONGO_URI);
          console.log(`Mongodb Connect `)
    }catch(error){
        console.error(`MongoDB connection Error ${error}`)
        process.exit(1)
    }
}


export default connectDB