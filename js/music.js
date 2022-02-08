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

	let prev;
	let oscmode = ['sine', 'triangle', 'sawtooth', 'square']; 

	p.setup = function ()
	{
		player = new Player();
		prev = new p5.Oscillator('square');
		prev.amp(1);

		p.noStroke();
		p.pixelDensity(1);
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
		sizeH = h / 7;

		p.createCanvas(partsN * sizeW, octaN * sizeH);

		grid = new Grid(bars.value(), beats.value(), parts.value(), octamin.value(), octamax.value());

		player.tact = 60.0 / tempo * 1000;
	};

	p.draw = function ()
	{
		p.clear();
		p.image(grid.graph, 0, 0);
		p.image(grid.notes, 0, 0);

		if(reload)
		{
			if (tone != toneS.value()) { tone = toneS.value(); player = new Player(oscmode[tone - 1]); }
			else if (tempo != tempoS.value()) { tempo = tempoS.value(); }
			else if (grid.min != octamin.value() || grid.max != octamax.value())
			{
				if (octamin.value() > octamax.value())
				{
					octamin.changevalue(octamax.value());
				}
				grid.min = octamin.value();
				grid.max = octamax.value();
				resize();
			}
			else
			{
				grid.bars = bars.value();
				grid.beats = beats.value();
				grid.parts = parts.value();
				resize();
			}

			player.tact = 60.0 / tempo / grid.parts * 1000;
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
	};

	p.windowResized = function ()
	{
		resize();
	}

	p.mouseClicked = function ()
	{
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
		sizeH = h / 7;
		p.resizeCanvas(partsN * sizeW, octaN * sizeH);

		grid.init();
	}

	class Player
	{
		constructor(type = 'sine')
		{
			this.zero = p.millis();
			this.tact = 1;
			this.array = [];
			for (let i = 0; i < 63; i++)
			{
				let n = i - 41;
				let osc = new p5.Oscillator(type);
				osc.amp(1);
				osc.freq(frequency(n));
				this.array.push(osc);
            }
		}

		play()
		{
			let delta = (p.millis() - this.zero);

			if (delta > this.tact)
			{
				for (let i = 0; i < this.array.length; i++)
				{
					this.array[i].start();
					this.array[i].stop(this.tact / 1000);
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

			this.clear();
			this.setup();
		}

		touch(mx, my)
		{
			let x = p.floor(mx / sizeW);
			let y = p.floor(my / sizeH);

			let len = this.beats * this.parts;

			let bar = p.floor(x / len);
			let beat = p.floor((x - (bar * len)) / this.parts);
			let part = p.floor(x - (bar * len) - (beat * this.parts));
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

			let n = (octa - 4) * 7 + (note - 5);

			prev.start();
			prev.freq(frequency(n));
			prev.stop(player.tact / 1000);
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

				let x = (n.bar * (this.beats * this.parts) + n.beat * this.parts + n.part) * sizeW;
				let y = p.height - ((((n.octa - this.min) * 7) + n.note + 1) * sizeH);
				this.notes.rect(x, y, sizeW, sizeH);
			}
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

	function frequency(n)
	{
		return 440 * p.pow(2, n / 12.0);
    }
};
new p5(music, 'music');