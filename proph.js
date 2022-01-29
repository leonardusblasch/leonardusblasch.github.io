let div = document.getElementById('bibel');

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

/*

for(let i = 0; i < bibel.length; i++)
{
    let text = document.createTextNode(i + 1 + ': ' + bibel[i][0][0]);
    let p = document.createElement('p');
    p.append(text);
    div.append(p);
}
*/



/*
let count = 0;

for(let book = 0; book < bibel.length; book++)
{
    for(let chap = 0; chap < bibel[book].length; chap++)
    {
        for(let vers = 0; vers < bibel[book][chap].length; vers++)
        {
            count++;
        }
    }
}


console.log(count);
*/
