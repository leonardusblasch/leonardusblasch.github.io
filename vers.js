const lim = 31103;

_input.oninput = verse;
_input.valueAsDate = new Date();

verse();

function verse() {
  if(_input.value == 0)
  {
    _title.innerHTML = null;
    _verse.innerHTML = null;
    return;
  }
  let value = new Date(_input.value);
  let date = value.getTime();
  let out = day_verse(date);
  _title.innerHTML = out[0];
  _verse.innerHTML = out[1];
}

function day_verse(date) {
  let num = random_seed(date) * lim;
  return get_verse(Math.floor(num));
}

function get_verse(num) {
  let count = 0
  let b_ = bibel.length;
  for(let b = 0; b < b_; b++) {
    let c_ = bibel[b].length;
    for(let c = 0; c < c_; c++) {
      let c_len = bibel[b][c].length;
      let next = count + c_len;
      if(next > num) {
        let v = num - count;
        let title = books[b] +
            " " + (c + 1) +
            ", " + (v + 1);
        let verse = bibel[b][c][v];
        return [title, verse];
      }
      else {
        count = next;
      }
    }
  }
}

function random_seed(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}