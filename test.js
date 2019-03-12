function makeShortURL() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let randomstring = '';
	for (var i = 0; i < 6; i++) {
    const ranChar = Math.floor(Math.random() * chars.length);
    const newChars = chars.substring(ranChar,ranChar+1)
    randomstring += newChars;
    console.log(randomstring);
  }
  return randomstring;
};
makeShortURL("BANDNAKENKRAWFKENmfa WPEITJWVPI MR");
