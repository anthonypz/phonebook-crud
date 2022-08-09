const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'A person name is required'],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'A person phone number is required'],
    validate: {
      validator: function (v) {
        return (
          /\d{3}-\d{3}-\d{4}/.test(v) ||
          /\d{2,3}-\d+/.test(v) ||
          /\d{1}-\d{3}-\d{3}-\d{4}/.test(v)
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
