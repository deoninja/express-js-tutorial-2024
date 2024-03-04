import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/discord-user.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize User`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: "1207233600047685683",
      clientSecret: "JlfKaaYqJSiCcDxspbPR5k_nRntsrn4F",
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discord: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const newSaveUser = await newUser.save();
          return done(null, newSaveUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

//client secret discord
//JlfKaaYqJSiCcDxspbPR5k_nRntsrn4F
//client id discord
//1207233600047685683
// redirect url = http://localhost:3000/api/auth/discord/redirect
