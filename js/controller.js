let r, g, b;

let controller = function (p)
{
	p.setup = function ()
	{
		p.noCanvas();
		r = p.createSlider(0, 255, 255);
		g = p.createSlider(0, 255, 215);
		b = p.createSlider(0, 255, 0);
	};
};
new p5(controller, 'controller');