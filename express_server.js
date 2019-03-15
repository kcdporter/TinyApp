const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//hardCoded db//
const urlDatabase = {
  b2xVn2: {longURL:"http://www.lighthouselabs.ca", user_id:"userRandomID", shortURL:'b2xVn2' },
  Bkjfw0: {longURL:"http://www.google.com", user_id:"user2RandomID", shortURL:'Bkjfw0'},
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
const emailLookup = (requestEmail) => {
  let database = (Object.values(users))
  let match = [];
  for (let user of database){
    match.push(user.email)
  }
  for (let email of match){
    if (requestEmail === email){
      return true;
    } else {
      continue;
    }
  }
}
const passwordLookup = (requestPassword) => {
  let database = (Object.values(users))
  let match = [];
  for (let user of database){
    match.push(user.password)
  }
  for (let password of match){
    if (requestPassword === password){
      return true;
    } else {
      continue;
    }
  }
}

function urlsForUser(requestUser) {
  let urlList = [];
  // urlList = {}
  for (var key in urlDatabase){
    let urlId = urlDatabase[key];
    if (requestUser === urlId.user_id){
      urlList.push(urlDatabase[key]);
      // urlList = [{},{}] 
    }
  }
  return urlList;
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
  const user_id = getRandom(req.body.email)
  const newUser = {
      user_id: user_id,
      email: req.body.email,
      password: req.body.password
    };
  if(!req.body.email || !req.body.password) {
    res.status(400).send(`Please fill out both email and password fields`)
  } else if (emailLookup(newUser.email) === true){
      res.status(400).send(`Email is already registered, please <a href="/login">Login</a>`)
  } else {
    users[user_id] = newUser;
    res.cookie('user_id', user_id);
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => {
  res.render("login");
})

app.post('/login', (req, res) => {
  isEmailMatch = (emailLookup(req.body.email));
  isPasswordMatch = (passwordLookup(req.body.password));
  if(!req.body.email || !req.body.password) {
    res.status(400).send(`Please fill out both email and password fields`)
  } else if (isEmailMatch && isPasswordMatch) {
    res.cookie('user_id', user_id )
    res.redirect('/urls');
  } else {  
    if(!isEmailMatch) {
    res.status(403).send(`Email address is not registered. Please <a href="/register">Register</a>`);
    } 
    res.status(403).send(`Password is not correct. Please <a href="/login">Try again</a>`);
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login")
})

//Reading URL Database 
app.get("/urls", (req, res) => {
  if (!req.cookies.user_id){
    res.redirect("/login");
  }
  let urlDb = urlsForUser(req.cookies.user_id);
  let templateVars = {
    urls: urlDb,
    users: users[req.cookies["user_id"]]
};
  res.render("urls_index", templateVars);
});

//Adding new URLs
app.get("/urls/new", (req, res) => {
  if(!req.cookies.user_id){
    res.redirect("/login")
  } else {
  let templateVars = { 
    users: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
  };
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = getRandom(longURL);
  urlDatabase[shortURL] = { longURL, user_id: (req.cookies.user_id), shortURL};
  let urlDb = urlsForUser(req.cookies.user_id);
  let templateVars = {
    urls: urlDb,
    users: users[req.cookies["user_id"]]
};
  // res.redirect(`/urls/${shortURL}`);
  res.render("urls_index", templateVars);
});

//Reading shortURLs
app.get("/urls/:shortURL", (req, res) => {
  console.log("req params", req.params)
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    users: users[req.cookies["user_id"]]
    };
  res.render("urls_show", templateVars);
});

//Edit && Delete URLs
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  console.log("edit long url", req.params.id);
  console.log("DB",)
  urlDatabase[shortURL] = { longURL, user_id: (req.cookies.user_id), shortURL};
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