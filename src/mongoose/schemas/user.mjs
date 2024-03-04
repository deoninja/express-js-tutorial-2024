import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

   username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
   },
   password: {
    type: mongoose.Schema.Types.String,
    required: true,
   },
   displayName: {
      type: mongoose.Schema.Types.String,
      required: true,
     },
});

export const User = mongoose.model("User", UserSchema);