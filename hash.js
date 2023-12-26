const bcrypt = require("bcrypt");

async function genHash(pwd) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);
  console.log(hash);
}

genHash("123dell");
