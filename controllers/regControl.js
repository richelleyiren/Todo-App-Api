const express = require("express");
const regModel = require("../models/regModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../errorHandling/userHelper");
const jwt = require("jsonwebtoken")
const { v4 : uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')
const crypto = require('crypto')


const newUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const newuser = new regModel({
      email,
      password,
      verifyToken:crypto.randomBytes(64).toString('hex'),
      verified: false,
    });

    const user = await newuser.save();

    //if user is saved and details are correct
    if (user) {
      //generate token
      const token = generateToken(user._id);

      //use token to set cookie
      // res.cookie("jwt", token, { maxAge: 3 * 24 * 60 * 60, httpOnly: true });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "richelleyiren@gmail.com",
          pass: "jpvwrqvaxjzkocsr",
        },
      });
      const confirmToken = newuser.verifyToken;

      const sendingg = {
        from: "richelleyiren@gmail.com",
        to: newuser.email,
        subject: "Verify Email ",
        text: ` Welcome to the tickytasky team!, please Click this link to confirm your email :
        http://localhost:3000/verified-email/${confirmToken}`,
      };

      //sending mail
      transporter.sendMail(sendingg, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }

        res.send(info);
      });

      res.status(201).json({ user });

      console.log("worked");

      console.log(token);
      console.log("user created");
    }

    //send verification mail to user 

    
  } catch (error) {
    console.log(error);
  }
};


//verified
const emailVerified = async (req,res)=>{
  try{
  //  const { confirmTokenn } = req.params;
  const {token} = req.params
    const person = await regModel.findOne({emailToken:token})
    if(person){
      person.verifyToken = null
      person.verified = true
     
      await person.save()
      
      console.log("email verification worked")
      
    }else{
      console.log('verify email please')
    }

  }catch(error){
    console.log(error)
  }

}

//login

const saveUser = async (req, res) => {
 
  try {
    const { email, password } = req.body;
     
    const user = await regModel.findOne({ email });

    // console.log(user)
    if (user) {
     
      const verifyCheck = user.verified;

      if (verifyCheck) {
         
        const isSame = await bcrypt.compare(password, user.password);
         console.log(isSame);
        if (isSame) {
           

          const token = generateToken(user._id);
          res.cookie("jwt", token, {
            maxAge: 3 * 24 * 60 * 60,
            httpOnly: true,
          });
          res.status(200).json({ user });
        } else{
          console.log("nope")
          res.json({message:"failed to log"})
        }
      } else {
        res.status(401).json({ errors: "Failed" });
      }
    } else if(!user.verified){
      return res
          .status(400)
          .send({
            msg: "Please check your mail to verify your account",
          });
    }else {
      res.json({ errors: " E-mail doesn't exist please sign up" });
    }
  } catch (error) {
    // const errors = handleErrors(error)
    console.log(error);
  }
};

//logout
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
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



// Password reset

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
            console.log( "this is the new password", newPassword)
            res.send('updated')
        }
       } catch(error){
         console.log(error)
       }
      });
  }
  }

  //forgotten password
  const forgottenPassword = async (req, res) => {
    try {
    
      const { email } = req.params;
      // const id = req.params.id;
      
      const resetToken = uuidv4();
      

      
      const updateUser = await regModel.findOneAndUpdate(
        { email },
        { resetToken },
        { new: true }
      );
      console.log(updateUser);

      if (!updateUser) {
        return res.status(401).json({message:'Email cannot be found'})
      }
       
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "richelleyiren@gmail.com",
            pass: "jpvwrqvaxjzkocsr",
          },
        });
           
        
        
        const sending = {
          from: "richelleyiren@gmail.com",
          to: `${email}`,
          subject: "Reset Password ",
          text: ` Kindly click on the link to reset your forgotten password :
        http://localhost:3000/reset-forgotten/${resetToken}`,
        };
        
      

        const request = await transporter.sendMail(sending)
        console.log(request)

        res.send('Please check your mail')

    } catch (error) {
      console.log(error);
    }
  };

  //resetting forgotten password
  const resetForgotten = async (req, res) => {

  try {
    //checking for token sent to the mail
  const { resetToken } = req.params
  const {newpass } = req.body

  const hashed = await bcrypt.hash(newpass, 10)
  
  const updateUser = await regModel.findOneAndUpdate({ resetToken }, {password: hashed}, {new: true} )
     console.log(updateUser);
      res.status(200).send(updateUser)

  } catch (error) {
    console.log(error)
  }
  
}





module.exports = {
  newUser,
  saveUser,
  logout,
  usersTodos,
  forgottenPassword,
  resetForgotten,
  passwordReset,
  emailVerified,
};
