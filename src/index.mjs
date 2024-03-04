import express, { request } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import Mongostore from "connect-mongo";
// import "./strategies/local-strategy.mjs"
import "./strategies/discord-strategy.mjs";

const app = express();

mongoose.connect('mongodb://localhost/express_tutorial')
  .then(() => console.log('Connected to Database'))
  .catch((err) => console.log(`Error: ${err}`));

//middleware
app.use(express.json());
// cookie parser
app.use(cookieParser("helloworld"));
// session
app.use(
  session({
    secret: "deo the dev",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    },
    store: Mongostore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//router
app.use(routes);

app.post('/api/auth', passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get('/api/auth/status', (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401)
});

app.post('/api/auth/logout', (request, response) => {
  if (!request.user) return response. sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  })
});

app.get('/api/auth/discord', passport.authenticate('discord'));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate('discord'),
  (request, response) => {
    console.log(request.user);
    console.log(request.session);
    response.sendStatus(200);
    // const token = req.user.tokenSet;
    // res.cookie("token", JSON.stringify(token));
    // res.redirect("/");
  }
);


const verifyDiscordUser = async (id) => {
  try{
    const user = await UserModel.findOne({'discordId': id}).exec();
    if(!user){
      throw new Error('No such discord account');
    }else{
      return user;
    }
  }catch(e){
    console.error(e);
    return null;
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);

  request.session.visited = true;

  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send({ msg: "Hello!" });
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser) return response.status(401).send({ msg: "BAD CREDENTIALS" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  request.sessionStore.get(request.sessionID, (err, session) => {
    console.log(session);
  })
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "NOT AUTHENTICATED" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  const { body: item } = request;

  const { cart } = request.session;
  if(cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});


//client secret discord
//JlfKaaYqJSiCcDxspbPR5k_nRntsrn4F
//client id discord
//1207233600047685683
// redirect url = http://localhost:3000/api/auth/discord/redirect