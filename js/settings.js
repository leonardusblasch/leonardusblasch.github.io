let r, g, b;

let settings = function (p)
{
	var myDiv = document.getElementById("settings");



	p.setup = function ()
	{
		p.noCanvas();
		r = p.createSlider(0, 255, 255);
		g = p.createSlider(0, 255, 215);
		b = p.createSlider(0, 255, 0);
	};

	class Slider
	{
		constructor(min, max, value, x, y, w, h)
		{
			this.slider = p.createSlider(min, max, value);
			p.slider.position(x, y);
			p.slider.style('width', w);
			p.slider.style('height', h);
		}

		value()
		{
			return this.slider.value();
		}
	}
};
new p5(settings, 'settings');