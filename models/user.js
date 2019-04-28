const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    Login:{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    }
},
{ 
  timestamps:true  
});

schema.set('toJSON',{
    virtuals:true
})

module.exports = mongoose.model('User', schema);