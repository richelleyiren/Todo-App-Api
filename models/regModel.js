const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const SignupSchema = new Schema({
  email: {
    type: String,
    required: [true, "Enter an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Enter a password"],
    minlength: [6, "Invalid password length"],
  },
  todos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Todolist",
    },
  ],

  resetToken: {
    type: String,
  },
  
  verifyToken:{
    type:String
  },

   verified:{
     type:Boolean,
     
     
   }
});

SignupSchema.pre("save", async function (next) {
  if( this.password.length > 50){
    next()

  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Users = mongoose.model("Users", SignupSchema);

module.exports = Users;
