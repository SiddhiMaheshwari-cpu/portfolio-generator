import {hash,compare} from "bcryptjs";
const h1=await hash("mypassword",10);
const h2=await hash("mypassword",10);
console.log(h1,h2);
console.log("same hash?", h1 === h2);
console.log("right password:", await compare("mypassword", h1));
console.log("wrong password:", await compare("wrongpassword", h1));