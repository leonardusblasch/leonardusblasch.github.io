let octamin, octamax;
let changednotes = false;

let notes = function (p)
{
	let wS;

	p.setup = function ()
	{
		p.noCanvas();
		p.noStroke();

		Init();
	};

	p.windowResized = function ()
	{
		octaminI= octamin.value();
		octamaxI = octamax.value();
		octamin.remove();
		octamax.remove();
		Init(octaminI, octamaxI);
	};

	function Init(octaminI = 1, octamaxI = 1)
	{
		let d = document.getElementById('settings');
		let w = d.clientWidth;
		let h = d.clientHeight;

		wS = w / 10;

		octamin = new Slider('Min', 1, 8, octaminI, wS, h / 2, wS, h * 0.1);
		octamax = new Slider('Max', 1, 8, octamaxI, 3 * wS, h / 2, wS, h * 0.1);
	}

	class Slider {
		constructor(text, min, max, value, x, y, w, h)
		{
			this.text = text;
			this.span = p.createSpan(text + ' (' + value + ')');
			this.span.position(x, 0);
			this.slider = p.createSlider(min, max, value);
			this.slider.position(x, y);
			this.slider.style('width', w + 'px');
			this.slider.style('height', h + 'px');
			this.slider.style('z-index', 1);
			this.slider.changed(this.changed.bind(this));
		}

		changed()
		{
			this.span.remove();
			this.span = p.createSpan(this.text + ' (' + this.slider.value() + ')');
			this.span.position(this.slider.x, 0);
			changednotes != changednotes;
		}

		value()
		{
			return this.slider.value();
		}

		remove()
		{
			this.span.remove();
			this.slider.remove();
		}
	}
};
new p5(notes, 'notes');