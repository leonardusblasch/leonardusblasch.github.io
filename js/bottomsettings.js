let tone, tempo;
let octamin, octamax;

let sound = function (p)
{
	p.setup = function ()
	{
		p.noCanvas();
		p.noStroke();

		Init();
	};

	p.windowResized = function ()
	{
		let toneI = tone.value();
		let tempoI = tempo.value();
		let octaminI = octamin.value();
		let octamaxI = octamax.value();
		tone.remove();
		tempo.remove();
		octamin.remove();
		octamax.remove();
		Init(toneI, tempoI, octaminI, octamaxI);
	};

	function Init(toneI = 1, tempoI = 1, octaminI = 0, octamaxI = 0)
	{
		let d = document.getElementById('bottomsettings');
		let w = d.clientWidth;
		let h = d.clientHeight;

		let size = w / 11;

		tone = new Slider('Tone', 1, 10, toneI, size, h / 2, size, h * 0.1);
		tempo = new Slider('Tempo', 1, 420, tempoI, 3 * size, h / 2, 3 * size, h * 0.1);
		octamin = new Slider('Min', 0, 8, octaminI, 7 * size, h / 2, size, h * 0.1);
		octamax = new Slider('Max', 0, 8, octamaxI, 9 * size, h / 2, size, h * 0.1);
	}

	class Slider {
		constructor(text, min, max, value, x, y, w, h) {
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

		changed() {
			this.span.remove();
			this.span = p.createSpan(this.text + ' (' + this.slider.value() + ')');
			this.span.position(this.slider.x, 0);
			reload = true;
		}

		value() {
			return this.slider.value();
		}

		changevalue(val) {
			this.slider.value(val);
			this.span.remove();
			this.span = p.createSpan(this.text + ' (' + this.slider.value() + ')');
			this.span.position(this.slider.x, 0);
		}

		remove() {
			this.span.remove();
			this.slider.remove();
		}
	}
};
new p5(sound, 'bottomsettings');