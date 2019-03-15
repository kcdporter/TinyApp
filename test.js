const urlDatabase = {
  b2xVn2: {longURL:"http://www.lighthouselabs.ca", user_id:"userRandomID"},
  Bkjfw0: {longURL:"http://www.google.com", user_id:"user2RandomID"},
  jhrewa: {longURL:"http://www.lighthouselabs.ca", user_id:"userRandomID"},
  FAWkfa: {longURL:"http://www.google.com", user_id:"user2RandomID"},

};

function urlsForUser(requestUser) {
  let urlList = [];
  for (var key in urlDatabase){
    let urlId = urlDatabase[key];
    if (requestUser === urlId.user_id){
      urlList.push(key);  
    }
  }
  console.log(urlList)
  return urlList;
}
urlsForUser('user2RandomID');