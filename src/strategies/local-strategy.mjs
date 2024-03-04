import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserialize User`);
    console.log(`Deserialize User ID: ${id}`);
    try {
        // const findUser = mockUsers.find((user) => user.id === id);
        const findUser = await User.findById(id)
        if (!findUser) throw new Error("user not found");
        done(null, findUser);
    } catch (err){
        done(err, null)
    }
});

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            // const  findUser = mockUsers.find((user) => user.username === username);
            // if (!findUser) throw new Error('User not found')
            // if (findUser.password !== password)
            //     throw new Error("Invalid Credentials");
            // done(null, findUser);
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error('User not found');
            if (!comparePassword(password, findUser.password)) throw new Error("Bad Credentials");
            done(null, findUser);
        } catch (err){
            done(err, null);
        }
    })
);