//importing modules

const nodemailer = require("nodemailer");
const regModel = require("../models/regModel");

//sending mail
const sendMail = (req, res) => {
  const { email, message, subject } = req.body;

  //email auth
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "richelleyiren@gmail.com",
      pass: process.env.password,
    },
  });

  //send mail body
  let sending = {
    from: "richelleyiren@gmail.com",
    to: `${email}`,
    subject: `${subject}`,
    text: `${message}`,
  };

  
  transporter.sendMail(sending, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }

    res.send(info);
  });
};

const verifyEmail = async(req,res,next) =>{ 
try{
   const user = await regModel.findOne({email:req.body.email})
   if(user.verified === true){
     next
   }else{
     console.log('please check your mail to verify your account')
   }
}catch(error){
  console.log(error)
}
}

module.exports = {
  sendMail,
  verifyEmail
};
