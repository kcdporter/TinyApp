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

const passwordLookup = (requestPassword) => {
  let database = (Object.values(users))
  let match = [];
  for (let user of database){
    match.push(user.password)
  }
  for (let password of match){
    if (requestPassword === password){
      console.log("true")
      return true;
    } else {
      console.log("false")
      continue;
    }
  }
}
passwordLookup('dishwasher-funk');