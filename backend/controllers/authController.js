const User = require('../models/User.js')
const jwt = require("jsonwebtoken");


//Generate jwt token
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:"4hr"});
}

// register user
exports.registerUser = async(req,res)=> {
    const {fullName, email, password, profileImageUrl} = req.body;

    //validation: check for missing fields
    if(!fullName || !email ||!password){
        return res.status(400).json({message:"All fields are required"})
    }
     try{
        // check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email Already in use"});
        }
        // creating a new user
        const user = await User.create({
            fullName,email,password,profileImageUrl
        });
        res.status(201).json({id:user._id,user,token:generateToken(user._id),})
     }
     catch(err){
        res.status(500).json({message:"Error Registering user",error:err.message})
     }
}

// login user
exports.loginUser = async(req,res)=> {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"invalid credentials"});
        }
        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });
    }catch(err){
        res.status(500).json({
            message:"Invalid crendentials", error:err.message
        })
    }
}

// get user info
exports.getUserInfo = async(req,res)=> {
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User Not found"});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({
            message:"Error registering user", error:err.message
        })
    }
}