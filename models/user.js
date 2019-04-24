const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    login:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},
{
    timestamps:true 
}
);

schema.set('toJSON',{
    virtuals:true
})

module.exports = mongoose.model('User', schema);