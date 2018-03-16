import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({
    email: email
  }).exec((err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) return callback(null, user);
      return callback(err);
    });
  });
};

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);
export default User;