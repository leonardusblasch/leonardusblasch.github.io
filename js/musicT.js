let playB, resetB;
let bars, beats, parts;

let settings = function (p)
{
	p.setup = function ()
	{
		p.noCanvas();
		p.noStroke();

		Init();
	};

	p.windowResized = function ()
	{
		playB.remove();
		resetB.remove();
		let barsI = bars.value();
		let beatsI = beats.value();
		let partsI = parts.value();
		bars.remove();
		beats.remove();
		parts.remove();
		Init(barsI, beatsI, partsI);
	};

	function Init(barsI = 1, beatsI = 1, partsI = 1)
	{
		let d = document.getElementById('musicT');
		let w = d.clientWidth;
		let h = d.clientHeight;

		let size = w / 14;

		let buttonSize = ((size / 2) < 33) ? 33 : size / 2;

		playB = p.createButton('▶');
		playB.position(size, h / 2 - size / 4);
		playB.style('width', buttonSize + 'px');
		playB.style('height', buttonSize + 'px');
		playB.mouseClicked(function () { playB.html(play ? '▶' : '⬛'); play = !play; });

		resetB = p.createButton('⟳');
		resetB.position(3 * size, h / 2 - size / 4);
		resetB.style('width', buttonSize + 'px');
		resetB.style('height', buttonSize + 'px');
		resetB.mouseClicked(function () { reset = true; });

		bars = new Slider('Bars', 1, 16, barsI, 5 * size, h / 2, size * 2, h * 0.1);
		beats = new Slider('Beats', 1, 8, beatsI, 8 * size, h / 2, size * 2, h * 0.1);
		parts = new Slider('Parts', 1, 4, partsI, 11 * size, h / 2, size * 2, h * 0.1);
    }

	class Slider
	{
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
			reload = true;
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
new p5(settings, 'musicT');