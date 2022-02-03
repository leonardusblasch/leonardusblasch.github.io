randomBib();

document.getElementById('reload').onclick = function()
{
    randomBib();
}

function randomBib()
{
    let link = document.getElementById('random');
    link.innerHTML = '';

    let rbook = randomInt(bibel.length);
    let rchap = randomInt(bibel[rbook].length);
    let rvers = randomInt(bibel[rbook][rchap].length);   

    let rinfo = books[rbook] + ' ' + (rchap + 1) + ', ' + (rvers + 1);
    let rbibel = bibel[rbook][rchap][rvers];

    link.href = '../bibel/index.html';
    link.innerHTML = '<u><strong>' + rinfo + '</strong></u>' + '<br>' + rbibel;
}

function randomInt(max)
{
    return Math.floor(Math.random() * max);
}