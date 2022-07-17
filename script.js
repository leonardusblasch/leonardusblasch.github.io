import { g } from "./fire.js";

let b = random(33 + 33);
let c = random(await g.chaps(b));
let v = random(await g.count(b, c));
let t = await g.title(b);

let info = `${t} ${c + 1}, ${v + 1}`;
let vers = await g.bible(b, c, v);

_info.innerHTML = info;
_vers.innerHTML = vers;

function random(max) {
  return Math.floor(Math.random() * max);
}
