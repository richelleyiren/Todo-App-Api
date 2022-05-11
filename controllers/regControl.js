const express = require("express");
const regModel = require("../models/regModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../errorHandling/userHelper");
const jwt = require("jsonwebtoken")

const newUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newuser = new regModel({
      email,
      password,
    });

    const user = await newuser.save();

    //if user is saved and details are correct
    if (user) {
      //generate token
      const token = generateToken(user._id);

      //use token to set cookie
      res.cookie("jwt", token, { maxAge: 3 * 24 * 60 * 60, httpOnly: true });

      console.log(token);
      console.log("user created");
    }

    res.status(201).json({ user });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

//login

const saveUser = async (req, res) => {
 
  try {
    const { email, password } = req.body;
      console.log("better work");
    const user = await regModel.findOne({ email });

  

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        const token = generateToken(user._id);
        res.cookie("jwt", token, { maxAge: 3 * 24 * 60 * 60, httpOnly: true });
        res.status(200).json({ user: user });
      } else {
        res.json({ errors: "Incorrect Password" });
      }
    } else {
      res.json({ errors: " E-mail doesn't exist please sign up" });
    }
  } catch (error) {
    // const errors = handleErrors(error)
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.cookies("jwt", "", {
      maxAge: -1,
    });
    res.status(200).json("success");
    console.log("working");
  } catch (error) {
    console.log(error);
  }
};

const usersTodos = async (req,res) =>{
  try{
    const { id } = req.params
    const user = await regModel.findById(id).populate('todos')

    user ? res.status(200).json(user) : res.status(500).json('sorry, user unavailable')
  } catch(error){
    console.log(error)
  }
}

//password reset

// const resetPassword = async (req,res) =>{
//  try {
//     const { email, password, resetPass } = req.body;
//   const userPass = await regModel.findOne({email})

//   if(userPass){
//     const compare = await bcrypt.compare(password, userPass.password)

//     const reset = {
//       password : resetPass
//     }

//     if(compare){
//       const salt = await bcrypt.genSalt();
//       reset.password = await bcrypt.hash(reset.password, salt);
//        const newPassword = await regModel.updateOne({ email:userPass.email }, reset);

//        res.status(200).json({message:'Password changed',newPassword})
       
//     }

//   }
// } catch(error){
//   console.log(error)
// }

// }

const passwordReset = async (req,res)=>{

  const {password,newPassword } = req.body

  const cookie = req.cookies.jwt

  if(cookie){
      jwt.verify(cookie, process.env.JWT_SECRET, async (err,decoded) =>{
       try{
          if(err){
          console.log(err)
          return res.status(403)
        }else{
          console.log(decoded)
          const user = await regModel.findOne({_id:decoded.id})
          console.log(user)

          const identical = await bcrypt.compare(password, user.password)
          if(!identical){
            return res.status(401).json({message:'wrong credentials'})
          }

          const hash = await bcrypt.hash(newPassword,12)

         await regModel.findOneAndUpdate({_id:decoded.id},
            {password:hash},{new:true})
            // console.log(update)
            res.send('updated')
        }
       } catch(error){
         console.log(error)
       }
      });
  }
  }



module.exports = {
  newUser,
  saveUser,
  logout,
  usersTodos,
  // resetPassword,
  passwordReset,
};
