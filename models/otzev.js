const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    body: {
      type: String
    },
    autor:{
      type: String
    }
  },
  {
    timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Otzev', schema);
