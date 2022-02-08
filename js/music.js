let reload = false;
let reset = false;
let play = false;

let music = function (p)
{
	let grid;
	let t, tt;
	let sizeW, sizeH;

	p.setup = function ()
	{
		p.noStroke();
		p.pixelDensity(1);
		let d = document.getElementById('music');
		let w = d.clientWidth;
		let h = d.clientHeight;

		t = tone.value();
		tt = tempo.value();

		let partsN = bars.value() * beats.value() * parts.value();
		sizeW = (partsN > 32) ? w / 32 : w / partsN;
		let octaN = (1 + octamax.value() - octamin.value()) * 7;
		sizeH = h / 7;

		p.createCanvas(partsN * sizeW, octaN * sizeH);

		grid = new Grid(bars.value(), beats.value(), parts.value(), octamin.value(), octamax.value());
	};

	p.draw = function ()
	{
		p.clear();
		p.image(grid.graph, 0, 0);
		p.image(grid.notes, 0, 0);

		if(reload)
		{
			if (t != tone.value()) { t = tone.value(); }
			else if (tt != tempo.value()) { tt = tempo.value(); }
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

			reload = false;
        }
	};

	p.windowResized = function ()
	{
		resize();
	}

	p.mouseClicked = function ()
	{
		grid.touch(p.mouseX, p.mouseY);
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

	class Grid
	{
		constructor(bars, beats, parts, min, max)
		{
			this.bars = bars;
			this.beats = beats;
			this.parts = parts;
			this.min = min;
			this.max = max;
			this.init(false);
			this.array = [];
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
			this.graph.background(255, 155, 0, 42);

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

			if (reset)
			{
				this.draw();
            }
		}

		touch(mx, my)
		{
			let x = p.floor(mx / sizeW);
			let y = p.floor(my / sizeH);

			if (this.array.some(n => n.x == x && n.y == y))
			{
				let i = this.array.indexOf(this.array.find(n => n.x == x && n.y == y));
				this.array.splice(i, 1);
			}
			else
			{
				this.array.push(new Note(x, y));
			}

			this.draw();
		}

		draw()
		{
			this.notes.clear();

			for (let i = 0; i < this.array.length; i++)
			{
				let current = this.array[i];
				this.notes.rect(current.x * sizeW, current.y * sizeH, sizeW, sizeH);
			}
        }
	}

	class Note
	{
		constructor(x, y)
		{
			this.x = x;
			this.y = y;
        }
    }
};
new p5(music, 'music');