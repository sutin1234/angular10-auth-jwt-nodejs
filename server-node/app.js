const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const express = require("express");
const app = express();

const refreshTokens = {};
const SECRET = "VERY_SECRET_KEY!";
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // decode Authorization header
  secretOrKey: SECRET,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

passport.use(
  new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000); // calculate expireDate
    if (expirationDate < new Date()) { // if expireDate < currentDate
      return done(null, false);
    }
    console.log("expirationDate ", expirationDate, 'CurrentDate ', new Date());
    done(null, jwtPayload);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

app.post("/login", function (req, res) {
  console.log('onLogin ');
  const { username, password } = req.body;
  const user = {
    username: username,
    role: "admin",
  };
  const token = jwt.sign(user, SECRET, { expiresIn: 600 });
  const refreshToken = randtoken.uid(256);
  refreshTokens[refreshToken] = username;
  res.json({ jwt: token, refreshToken: refreshToken });
});

app.post("/logout", function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }
  res.sendStatus(204);
});

app.post("/refresh", function (req, res) {
  console.log("onRefresh token ");
  const refreshToken = req.body.refreshToken;

  if (refreshToken in refreshTokens) {
    const user = {
      username: refreshTokens[refreshToken],
      role: "admin",
    };
    const token = jwt.sign(user, SECRET, { expiresIn: 600 });
    res.json({ jwt: token });
  } else {
    res.sendStatus(401);
  }
});

app.get("/random", passport.authenticate("jwt"), function (req, res) {
  console.log("onRandom token ");
  res.json({ value: Math.floor(Math.random() * 100) });
});

app.listen(3000);
console.log('server serve on http://localhost:3000');
