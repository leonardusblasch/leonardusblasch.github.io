let music = function (p)
{
	let s = 100;

	p.setup = function ()
	{
		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		s = p.max(w, h) / 13;

		let c = p.createCanvas(w, h);
		c.parent('music');
		p.noStroke();

	};

	p.draw = function ()
	{
		p.clear();
		p.background(r.value(), g.value(), b.value(), 77);
	};

	p.windowResized = function ()
	{
		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		p.resizeCanvas(w, h);
	}
};
new p5(music, 'music');