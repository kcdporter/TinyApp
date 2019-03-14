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

const emailLookup = (requestEmail) => {
  let database = (Object.values(users))
  let match = [];
  for (let user of database){
    match.push(user.email)
  }
  for (let email of match){
    if (requestEmail === email){
      console.log("Match");
    } else {
      continue;
    }
  }
}

emailLookup('user2@example.com')
