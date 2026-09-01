import {model, Schema} from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 2,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
  },
},
  {
    timestamps: true,
    versionKey: false,
  },
);

async function saveUsername() {
  if(!this.username) {
    this.username = this.email;
  }
}

userSchema.pre("save", saveUsername);

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model("User", userSchema);

export default User;

