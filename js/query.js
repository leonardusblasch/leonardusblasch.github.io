let booksv = ['1mose','2mose','3mose','4mose','5mose','josua','richter','ruth','1samuel','2samuel','1könige','2könige','1chronik','2chronik','esra','nehemia','esther','hiob','psalm','prediger','hohelied','jesaja','jeremia','klagelieder','sprüche','hesekiel','daniel','hosea','joel','amos','obadja','jona','micha','nahum','habakuk','zephanja','haggai','sacharja','maleachi','matthäus','markus','lukas','johannes','apostelgeschichte','römer','1korinther','2korinther','galater','epheser','philipper','kolosser','1thessalonicher','2thessalonicher','1timotheus','2timotheus','titus','philemon','hebräer','jakobus','1petrus','2petrus','1johannes','2johannes','3johannes','judas','offenbarung'];

let all = 'all';

let bsel = document.getElementById('buchS');
let ksel = document.getElementById('kapitelS');
let vsel = document.getElementById('versS');

let ball = false;
let kall = false;
let vall = false;

let prevB = document.getElementById('prev');
let nextB = document.getElementById('next');

initBuch();

prevB.onclick = function()
{
    let bn = Number(bsel.value);
    let kn = Number(ksel.value);
    let vn = Number(vsel.value);

    if(vn > 0)
    {
        vn--;
        vsel.value = vn;
    }
    else
    {
        if(kn > 0)
        {
            kn--;
            ksel.value = kn;
            initVers();
            vsel.value = bibel[bn][kn].length - 1;
        }
        else
        {
            if(bn > 0)
            {
                bn--;
                bsel.value = bn;
                initKapitel();
                kn = ksel.value = bibel[bn].length - 1;
                initVers();
                vsel.value = bibel[bn][kn].length - 1;
            }
            else
            {
                bn = bsel.value = bibel.length - 1;
                initKapitel();
                kn = ksel.value = bibel[bn].length - 1;
                initVers();
                vsel.value = bibel[bn][kn].length - 1;
            }
        }
    }

    query();
};

nextB.onclick = function()
{
    let bn = Number(bsel.value);
    let kn = Number(ksel.value);
    let vn = Number(vsel.value);

    if(vn < bibel[bn][kn].length - 1)
    {
        vn++;
        vsel.value = vn;
    }
    else
    {
        if(kn < bibel[bn].length - 1)
        {
            kn++;
            ksel.value = kn;
        }
        else
        {
            if(bn < bibel.length - 1)
            {
                bn++;
                bsel.value = bn;
            }
            else
            {
                bn = bsel.value = 0;
            }

            initKapitel();
            ksel.value = 0;
        }
        initVers();
        vsel.value = 0;
    }

    query();
};

bsel.onchange = function()
{
    initKapitel();
    ksel.value = 0;
    initVers();
    vsel.value = 0;

    query();
};


ksel.onchange = function()
{

    initVers();
    vsel.value = 0;

    query();
};

vsel.onchange = function()
{
    query();
};

function initBuch()
{
    for(var i = 0; i < booksv.length; i++)
    {
        var opt = document.createElement('option');
        opt.innerHTML = books[i];
        opt.value = i;
        bsel.appendChild(opt);
    }

    /*
    var opt = document.createElement('option');
    opt.innerHTML = '+++++++';
    opt.value = all;
    bsel.appendChild(opt);
    */

    initKapitel();
    ksel.value = 0;
    initVers();
    vsel.value = 0;
    query();
}

function initKapitel()
{
    ksel.innerHTML = '';

    for(let i = 0; i < bibel[bsel.value].length; i++)
    {
        var opt = document.createElement('option');
        opt.innerHTML = i + 1;
        opt.value = i;
        ksel.appendChild(opt);
    }
    /*
    var opt = document.createElement('option');
    opt.innerHTML = '+++';
    opt.value = all;
    ksel.appendChild(opt);
    */
}

function initVers()
{
    vsel.innerHTML = '';

    for(let i = 0; i < bibel[bsel.value][ksel.value].length; i++)
    {
        var opt = document.createElement('option');
        opt.innerHTML = i + 1;
        opt.value = i;
        vsel.appendChild(opt);
    }

    /*
    var opt = document.createElement('option');
    opt.innerHTML = '+++';
    opt.value = all;
    vsel.appendChild(opt);
    */
}

function query()
{
    if(!ball && !kall && !vall)
    {
        let vers = document.getElementById('query');

        vers.innerHTML = '';

        let text = document.createTextNode(bibel[bsel.value][ksel.value][vsel.value]);

        vers.appendChild(text);
    }
}