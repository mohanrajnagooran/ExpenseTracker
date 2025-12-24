const mongoose = require("mongoose");

const connectDB  = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{});
        console.log("MONGODB CONNECTED");
    }
    catch(err){
        console.log("Error connecting to mongodb", err);
        process.exit(1);
    }
};
 
module.exports= connectDB;
