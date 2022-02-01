let div = document.getElementById('rvers');

let rbook = randomInt(bibel.length);
let rchap = randomInt(bibel[rbook].length);
let rvers = randomInt(bibel[rbook][rchap].length);
let rbibel = bibel[rbook][rchap][rvers];

let info = books[rbook] + ' ' + (rchap + 1) + ', ' + (rvers + 1);
let text = document.createTextNode(rbibel);
let infop = document.createElement('p');
let textp = document.createElement('p');
infop.append(info);
textp.append(text);
div.append(infop);
div.append(textp);

function randomInt(max)
{
    return Math.floor(Math.random() * max);
}