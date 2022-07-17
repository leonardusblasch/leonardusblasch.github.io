let title = ['1 Mose','2 Mose','3 Mose','4 Mose','5 Mose','Josua','Richter','Ruth','1 Samuel','2 Samuel','1 Könige','2 Könige','1 Chronik','2 Chronik','Esra','Nehemia','Esther','Hiob','Psalm','Prediger','Hohelied','Jesaja','Jeremia','Klagelieder','Sprüche','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zephanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1 Korinther','2 Korinther','Galater','Epheser','Philipper','Kolosser','1 Thessalonicher','2 Thessalonicher','1 Timotheus','2 Timotheus','Titus','Philemon','Hebräer','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Offenbarung'];

import { g } from "./fire.js";

let b = 0, c = 0, v = 0;
let books = 33 + 33;
let chaps = await g.chaps(b);
let count = await g.count(b, c);

options(_book, books, 0, true);
options(_chap, chaps);
options(_vers, count);

bib();

_book.onchange = async () => {
  b = parseInt(_book.value);
  c = 0;
  v = 0;
  chaps = await g.chaps(b);
  options(_chap, chaps);
  count = await g.count(b, c);
  options(_vers, count);
  bib();
};

_chap.onchange = async () => {
  c = parseInt(_chap.value);
  v = 0;
  count = await g.count(b, c);
  options(_vers, count);
  bib();
};

_vers.onchange = async () => {
  v = parseInt(_vers.value);
  bib();
};

_prev.onclick = async () => {
  v--;
  if(v == -1) {
    c--;
    _chap.value = v;
    if(c == -1) {
      b--;
      _book.value = v;
      if(b == -1) {
        b = books - 1;
        _book.value = b;
      }
      else {
        _book.value = b;
      }
      chaps = await g.chaps(b);
      c = chaps - 1;
      options(_chap, chaps, c);
    }
    count = await g.count(b, c);
    v = count - 1;
    options(_vers, count, v);
  }
  else {
    _vers.value = v;
  }
  bib();
};

_next.onclick = async () => {
  v++;
  if(v == count) {
    c++;
    if(c == chaps) {
      b++;
      if(b == books) {
        b = 0;
      } else {
        _book.value = b;
      }
      chaps = await g.chaps(b);
      c = 0;
      options(_chap, chaps);
    }
    count = await g.count(b, c);
    v = 0;
    options(_vers, count);
  }
  else {
    _vers.value = v;
  }
  bib();
};

async function bib() {
  let t = title[b];
  let info = `${t} ${c + 1}, ${v + 1}`;
  let vers = await g.bible(b, c, v);
  _info.innerHTML = info;
  _text.innerHTML = vers;
}

function options(select, max, value = 0, book = false) {
  select.innerHTML = "";
  for(let i = 0; i < max; i++) {
    select.appendChild(new Option(book ? title[i] : i + 1, i, null, i == value));
  }
}