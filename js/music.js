let music = function (p)
{
	let grid;

	p.setup = function ()
	{
		p.noStroke();

		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		p.createCanvas(w, h);
	};

	p.draw = function ()
	{
		p.clear();
		p.background(255, 255, 255, 100);
	};

	p.windowResized = function ()
	{
		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		p.resizeCanvas(w, h);
	}

	class Grid
	{
		constructor(bar, beat, part)
		{

        }
    }
};
new p5(music, 'music');