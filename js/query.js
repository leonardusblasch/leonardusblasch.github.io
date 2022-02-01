let prevB = document.getElementById('prev');
let nextB = document.getElementById('next');

let bsel = document.getElementById('buchS');
let ksel = document.getElementById('kapitelS');
let vsel = document.getElementById('versS');

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
    for(var i = 0; i < books.length; i++)
    {
        var opt = document.createElement('option');
        opt.innerHTML = books[i];
        opt.value = i;
        bsel.appendChild(opt);
    }

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
}

function query()
{
    let query = document.getElementById('query');
    query.innerHTML = '';

    let text = document.createTextNode(bibel[bsel.value][ksel.value][vsel.value]);
    query.appendChild(text);
}