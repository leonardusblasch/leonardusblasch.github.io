let reload = false;
let reset = false;
let play = false;
let mouse = false;

let music = function (p)
{
	let grid;
	let tone, tempo;
	let sizeW, sizeH;

	let player;

	let notename = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	let tact = 1;
	let len = 1;
	let prev;


	p.setup = function ()
	{
		p.pixelDensity(1);

		prev = new p5.MonoSynth();
		player = new Player();

		let d = document.getElementById('music');
		d.onmouseover = function () { mouse = true; }
		d.onmouseout = function () { mouse = false; }
		let w = d.clientWidth;
		let h = d.clientHeight;

		tone = toneS.value();
		tempo = tempoS.value();

		let partsN = bars.value() * beats.value() * parts.value();
		sizeW = (partsN > 32) ? w / 32 : w / partsN;
		let octaN = (1 + octamax.value() - octamin.value()) * 7;
		sizeH = (octaN > 14) ? h / 14 : h / octaN;

		p.createCanvas(partsN * sizeW, octaN * sizeH);

		grid = new Grid(bars.value(), beats.value(), parts.value(), octamin.value(), octamax.value());

		tact = (60.0 / tempo);
	};

	p.draw = function ()
	{
		p.clear();
		p.image(grid.graph, 0, 0);
		p.image(grid.notes, 0, 0);

		if (reload)
		{
			if (tone != toneS.value())
			{
				tone = toneS.value();
				player = new Player();
			}
			else if (tempo != tempoS.value()) { tempo = tempoS.value(); }
			else if (grid.min != octamin.value() || grid.max != octamax.value())
			{
				if (octamax.value() < octamin.value())
				{
					octamax.changevalue(octamin.value());
				}
				grid.min = octamin.value();
				grid.max = octamax.value();
				resize();

				let d = document.getElementById('music');
				d.scrollTop = p.height;
			}
			else
			{
				grid.bars = bars.value();
				grid.beats = beats.value();
				grid.parts = parts.value();
				resize();
			}

			tact = 60.0 / (tempo * grid.parts);
			player = new Player();
			reload = false;
		}

		if (reset)
		{
			grid.array = [];
			grid.clear();
			grid.setup();
			reset = false;
		}

		if (play)
		{
			player.play();
		}
		else
		{
			player.line();
		}
	};

	p.windowResized = function ()
	{
		resize();
	}

	p.mouseClicked = function ()
	{
		p.userStartAudio();
		if (mouse)
		{
			grid.touch(p.mouseX, p.mouseY);
		}
	}

	function resize()
	{
		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		let partsN = bars.value() * beats.value() * parts.value();
		sizeW = (partsN > 32) ? w / 32 : w / partsN;
		let octaN = (1 + octamax.value() - octamin.value()) * 7;
		sizeH = (octaN > 14) ? h / 14 : h / octaN;
		p.resizeCanvas(partsN * sizeW, octaN * sizeH);

		grid.init();
	}

	class Player
	{
		constructor()
		{
			this.synth = new p5.PolySynth(PeriodicWave, 7 * 8);
			this.zero = p.millis();
			this.count = -1;
			this.off = 0;
		}

		line()
		{
			p.line(this.off, 0, this.off, p.height);
		}

		play()
		{
			let delta = (p.millis() - this.zero) / 1000;

			if (this.count != -1)
			{
				this.off = p.map(((this.count) * tact) + delta, 0, len * tact, 0, p.width);

				p.line(this.off, 0, this.off, p.height);

				let d = document.getElementById('music');
				d.scrollLeft = this.off - d.clientWidth / 2;
			}

			if (this.count == -1 || delta > tact)
			{
				this.count++;

				let sounds = grid.array.filter(n => ((n.bar * (grid.beats * grid.parts) + (n.beat * grid.parts) + n.part) == this.count));

				for (let i = 0; i < sounds.length; i++)
				{
					let n = notename[sounds[i].note] + sounds[i].octa;
					this.synth.play(n, 1, 0, tact);
				}

				if (this.count >= len)
				{
					this.count = -1;
				}

				this.zero = p.millis();
			}
		}
	}

	class Grid
	{
		constructor(bars, beats, parts, min, max)
		{
			this.bars = bars;
			this.beats = beats;
			this.parts = parts;
			this.min = min;
			this.max = max;
			this.array = [];
			this.init(false);
		}

		init(reset = true)
		{
			if (reset)
			{
				this.graph.remove();
				this.notes.remove();
			}
			this.graph = p.createGraphics(p.width, p.height);
			this.notes = p.createGraphics(p.width, p.height);

			this.graph.strokeWeight(1);
			this.graph.stroke(52);

			let octa = 1 + this.max - this.min;
			for (let i = 0; i <= octa * 7; i++)
			{
				this.graph.strokeWeight((i % 7 == 0) ? 5 : 3);
				let y = i * sizeH;
				this.graph.line(0, y, p.width, y);
			}

			let x = 0;
			for (let bar = 0; bar < this.bars; bar++)
			{
				this.graph.strokeWeight(5);
				for (let beat = 0; beat < this.beats; beat++)
				{
					for (let part = 0; part < this.parts; part++)
					{
						this.graph.line(x, 0, x, p.height);
						x += sizeW;
						this.graph.strokeWeight(1);
					}
					this.graph.strokeWeight(3);
				}
			}
			this.graph.strokeWeight(5);
			this.graph.line(x, 0, x, p.height);

			len = this.bars * this.beats * this.parts;

			this.clear();
			this.setup();
		}

		clear()
		{
			for (let i = this.array.length - 1; i >= 0; i--)
			{
				let n = this.array[i];

				if (n.bar >= this.bars || n.beat >= this.beats || n.part >= this.parts || n.octa < this.min || n.octa > this.max)
				{
					this.array.splice(i, 1);
				}
			}
		}

		setup()
		{
			this.notes.clear();

			for (let i = 0; i < this.array.length; i++)
			{
				let n = this.array[i];

				let x = (n.bar * (grid.beats * grid.parts) + (n.beat * grid.parts) + n.part) * sizeW;
				let y = p.height - ((((n.octa - this.min) * 7) + n.note + 1) * sizeH);
				this.notes.rect(x, y, sizeW, sizeH);
			}
		}

		touch(mx, my)
		{
			let x = p.floor(mx / sizeW);
			let y = p.floor(my / sizeH);

			let d = this.beats * this.parts;

			let bar = p.floor(x / d);
			let beat = p.floor((x - (bar * d)) / this.parts);
			let part = p.floor(x - (bar * d) - (beat * this.parts));
			let octa = this.max - p.floor(y / 7);
			let note = 6 - (y % 7);

			if (this.array.some(n => n.bar == bar && n.beat == beat && n.part == part && n.octa == octa && n.note == note))
			{
				let i = this.array.indexOf(this.array.find(n => n.bar == bar && n.beat == beat && n.part == part && n.octa == octa && n.note == note));
				this.array.splice(i, 1);
			}
			else
			{
				this.array.push(new Note(bar, beat, part, octa, note));
			}

			this.setup();

			let n = notename[note] + octa;
			prev.play(n, 1, 0, tact);
		}
	}

	class Note
	{
		constructor(bar, beat, part, octa, note)
		{
			this.bar = bar;
			this.beat = beat;
			this.part = part;
			this.octa = octa;
			this.note = note;
		}
	}

	function getEnv()
	{
		let half = tact / 2;
		return new p5.Envelope(half, 1, tact, 0)
    }

	function PeriodicWave(params)
	{
		p5.AudioVoice.call(this);
		this.osc = new p5.Oscillator('sine');

		this.real = new Float32Array([0, 0]);
		this.imag = new Float32Array([0, 1]);
		this.wt = this.ac.createPeriodicWave(this.real, this.imag);

		this.osc.disconnect();
		this.osc.start();

		//this.env = new p5.Envelope(0.021, 0.025, 0.025, 0.025, 0.95, 0.33, 0.25);

		this.env = getEnv();
		this.env.disconnect();

		this.filter = new p5.LowPass();
		this.filter.set(22050, 5);


		this.env.connect(this.filter);
		this.osc.connect(this.filter);

		this.connect();

		this.filter.set(22050, 5);


		this.setParams = function (params)
		{
			this.real = new Float32Array(params.real);
			this.imag = new Float32Array(params.imag);
			this.wt = this.ac.createPeriodicWave(this.real, this.imag);
			this.osc.oscillator.setPeriodicWave(this.wt);
		}

		this.setADSR = function (aTime, aLevel, dTime, dLevel)
		{
			this.env.set(aTime, aLevel, dTime, dLevel)
		}

		this.play = function ()
		{
			this.env.play(this.filter);

		}

		this.triggerAttack = function (note, velocity, secondsFromNow)
		{
			var secondsFromNow = secondsFromNow || 0;

			//triggerAttack uses ._setNote to convert a midi string to a frequency if necessary
			var freq = typeof note === 'string' ? this._setNote(note)
				: typeof note === 'number' ? note : 440;
			var vel = velocity || 1;
			// this.env.setRange(this.env.aLevel / velocity,0);
			this._isOn = true;
			this.osc.freq(freq, 0, secondsFromNow);
			this.env.triggerAttack(this.filter, secondsFromNow);

		}

		this.triggerRelease = function (secondsFromNow)
		{
			var secondsFromNow = secondsFromNow || 0;
			this.env.triggerRelease(this.filter, secondsFromNow);
			this._isOn = false;
		}

	}

	PeriodicWave.prototype = new p5.AudioVoice();
	PeriodicWave.prototype.constructor = PeriodicWave;


	//////////////////////////////////////////////////////////////////////////////////////////////
	// A typical synth class which inherits from AudioVoice class
	function SquareVoice()
	{

		p5.MonoSynth.call(this);

		this.oscillator.setType('square');
	}
	SquareVoice.prototype = Object.create(p5.MonoSynth.prototype);  // browsers support ECMAScript 5 ! warning for compatibility with older browsers
	SquareVoice.prototype.constructor = SquareVoice;

	//////////////////////////////////////////////////////////////////////////////////////////////
	// A Detuned synth
	function DetunedOsc()
	{

		p5.MonoSynth.call(this);

		this.osctype = 'sine';
		this.detune = -5;

		this.oscOne = this.oscillator;
		this.oscTwo = new p5.Oscillator();

		this.filter.setType('lowpass');
		this.filter.set(22050, 5);

		this.oscOne.disconnect();
		this.oscTwo.disconnect();


		this.oscOne.connect(this.filter);
		this.oscTwo.connect(this.filter);


		this.env.setInput(this.oscOne, this.oscTwo);

		this.oscOne.start();
		this.oscTwo.start();


		this.triggerAttack = function (note, velocity, secondsFromNow)
		{
			this.oscTwo.oscillator.detune.value
			var secondsFromNow = secondsFromNow || 0;
			var freq = typeof note === 'string' ? this._setNote(note)
				: typeof note === 'number' ? note : 440;
			var vel = velocity || 1;

			this._isOn = true;

			this.oscOne.freq(freq, 0, secondsFromNow);
			this.oscTwo.freq(freq + this.detune, 0, secondsFromNow);
			this.env.ramp(this.output, secondsFromNow, this.env.aLevel);
		}

	}

	DetunedOsc.prototype = Object.create(p5.MonoSynth.prototype);
	DetunedOsc.prototype.constructor = DetunedOsc;



	function AdditiveSynth()
	{
		p5.MonoSynth.call(this);

		this.osctype = 'triangle';
		this.harmonics = [1, 2, 4, 6, 8];
		this.note = 60;

		this.oscbank = [];
		this.oscillator.dispose();
		delete this.oscillator;
		this.env.disconnect();

		for (var i = 0; i < this.harmonics.length; i++)
		{
			this.oscbank.push(new p5.Oscillator());
			this.oscbank[i].setType(this.osctype);
			this.oscbank[i].disconnect();
			this.oscbank[i].connect(this.filter);
			this.env.connect(this.oscbank[i]);
			this.oscbank[i].start();
		}

		this.triggerAttack = function (note, velocity, secondsFromNow)
		{
			var secondsFromNow = secondsFromNow || 0;
			var freq = typeof note === 'string' ? this._setNote(note)
				: typeof note === 'number' ? note : 440;
			var vel = velocity || 1;

			this._isOn = true;

			for (var i = 0; i < this.harmonics.length; i++)
			{
				this.oscbank[i].freq(freq + midiToFreq(this.harmonics[i] * 12), 0, secondsFromNow);
			}

			this.env.ramp(this.output, secondsFromNow, this.env.aLevel);
		}

	}
	AdditiveSynth.prototype = Object.create(p5.MonoSynth.prototype);
	AdditiveSynth.prototype.constructor = AdditiveSynth;
};
new p5(music, 'music');