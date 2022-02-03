let background = function(p)
{
	let t = 0;
	let r = 0.0005;
	let s = 100;

    p.setup = function()
	{
		let d = document.getElementById('background');
		let w = d.clientWidth;
		let h = d.clientHeight;

		s = p.max(w, h) / 13;

		p.createCanvas(w, h);
	};
	
	p.draw = function()
	{
		p.noStroke();

		for(let x = 0; x < p.width; x += s)
		{
			for(y = 0; y < p.height; y += s)
			{
				let n1 = p.noise(x * r, y * r, t);
				let n2 = p.noise(y * r, t, x * r);
				let n3 = p.noise(t, y * r, x * r);
				
				p.fill(177.5 + n1 * 77.5, 177 + n2 * 77.5, 177.5 + n3 * 77.5, 255);
				p.rect(x, y, s);
			}
			t += 0.001;
		}
	};
	
	p.windowResized = function()
	{
		let d = document.getElementById('background');
		let w = d.clientWidth;
		let h = d.clientHeight;

		s = p.max(w, h) / 13;

		p.resizeCanvas(w, h);
    }
};

new p5(background, 'background');