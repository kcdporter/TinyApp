const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// setting global template vars
app.use(function(req, res, next) {
  res.locals.username = req.cookies.username;
  next();
});

//hardCoded db//
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//functions
function getRandom() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let randomstring = '';
	for (var i = 0; i < 6; i++) {
    const ranChar = Math.floor(Math.random() * chars.length);
    const newChars = chars.substring(ranChar,ranChar+1)
    randomstring += newChars;
  }
  return randomstring;
};

function emailLookup(requestEmail) {
  for (var user_id in users) {
    let user = users[user_id];
    if(user.email === req.body.email)
      return user_id;
  }
  return false;
}

//base routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Register && Login && Logout
app.get('/register', (req, res) => {
  let templateVars = { 
    users: users[req.cookies["user_id"]]
  };
  res.render("registration", templateVars);
})

app.post('/register', (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send(`Please fill out both email and password fields`)
  } 
  // else if {
  //   if (emailLookup(req.body.email) {
  //     res.status(400).send(`Email is already registered, please <a href="/login">Login</a>`)
  //   })
  // } else {
  // const user_id = getRandom(req.body.email);
  // const newUser = {
  //   user_id: user_id,
  //   userEmail: req.body.email,
  //   userPassword: req.body.password
  // };
  // users[user_id] = newUser;
  // res.cookie('user_id', user_id);
  // res.redirect('/urls');
  // }
});

app.get('/login', (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    users: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
})

app.post('/login', (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    users: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
})

app.post('/logout', (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    users: users[req.cookies["user_id"]]
  };
  res.clearCookie('username', req.body.username);
  res.render("urls_index", templateVars);
})

//Reading URL Database 
app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    users: users[req.cookies["user_id"]]
};
  res.render("urls_index", templateVars);
});

//Adding new URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = getRandom(longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

//Reading shortURLs
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL,
     longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

//Edit && Delete URLs
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Redirect to LongURL
app.get("/u/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});