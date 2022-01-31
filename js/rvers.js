let books = ['1 Mose','2 Mose','3 Mose','4 Mose','5 Mose','Josua','Richter','Ruth','1 Samuel','2 Samuel','1 Könige','2 könige','1 Chronik','2 Chronik','Esra','Nehemia','Esther','Hiob','Psalm','Prediger','Hohelied','Jesaja','Jeremia','Klagelieder','Sprüche','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zephanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1 Korinther','2 Korinther','Galater','Epheser','Philipper','Kolosser','1 Thessalonicher','2 Thessalonicher','1 Timotheus','2 Timotheus','Titus','Philemon','Hebräer','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Offenbarung'];

let div = document.getElementById('vers');

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
