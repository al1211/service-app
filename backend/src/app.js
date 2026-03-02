import express from "express";
import cors from "cors";
import helmet from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js"



const app=express();



// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// connect db

connectDB();


// Routes
app.use("/api/v1/auth",authRoutes);


// Health

app.use("/health",(req,res)=>{
    res.json({status:"OK"})
})


app.use((req,res)=>{
    res.status(404).json({success:false,message:"Route not found"})
});


// app.use()

export default app