const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({

      email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
        unique:true
      },
      password: {type:String,required:true},
      userId : {type:ObjectId,required:true,unique:true},
      lastLogin : Date
  },{timestamps:true})
