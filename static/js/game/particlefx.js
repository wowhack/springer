Particle = function(spriteid, x, y, vx, vy, r, g) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.r = Math.random() * 360;
	this.g = g || 1.0;
	this.drag = this.g;
	this.spriteid = spriteid;
}

Math.sign = function(v) {
	if (v >= 0) return 1;
	return -1;
}

Particle.prototype.update = function() {
		this.x += this.vx;
		this.y += this.vy;
		this.vy -= this.g;
		this.vx -= this.drag * Math.sign(this.vx);
		this.r += 0.1;
}


Explosion = function (sprites, duration, particle_count, x, y) {
	this.alive = false;
	this.duration = duration;
	this.running_time = 0;
	this.stamp = 0;
	this.count = particle_count;
	this.ps = []
	for (var i = 0; i < particle_count; i += 1) {
		var idx = Math.floor(Math.random() * sprites.length);
		var p = new Particle(sprites[idx], x, y, (Math.random()-0.5) * 80.0, (Math.random() + 1.0) * 22.0, 0.0);
		this.ps.push(p)
	}
	
}

Explosion.prototype.start = function() {
	this.alive = true;
	this.start_time = (new Date()).getTime();
}

Explosion.prototype.update = function () {
	console.log(this.alive)
	if (!this.alive)
		return;
	this.running_time = (new Date()).getTime() - this.start_time;
	console.log(this.running_time)
	if (this.running_time > this.duration) {
		this.alive = false;
		return;
	}
	for (var i = 0; i < this.ps.length; i += 1) {
		this.ps[i].update();
	}
}

ParticleRunner = function() {
	this.batches = []
	this.particles = []
	this.textures = []

	this.shader = new PXF.Shader(pp.ctx,
		"static/shaders/particle.vs", 
		"static/shaders/particle.fs",
		true);
	this.textures.push(pp.get_resource( "korv_0" ));
	this.textures.push(pp.get_resource( "korv_1" ));
	for (var i = 0; i < this.textures.length; i = i + 1) {
		var b = new PXF.QuadBatch(pp.ctx);
		b.depth = 1;
		this.batches.push(b);
	}
}

ParticleRunner.prototype.create_korvparty = function(count, x, y) {
	var sp = new Explosion([0, 1], 6000, count, x, y);
	sp.start();
	this.particles.push(sp);
}

ParticleRunner.prototype.update = function() {
	for (var i = 0; i < this.batches.length; i += 1) {
		this.batches[i].Reset();
	}

	var remove = []
	for(var i = 0; i < this.particles.length; i += 1) {
		var particle = this.particles[i];
		particle.update();
		if (!particle.alive) {
			console.log("Particle " + i + " died.");
			remove.push(particle);
			continue;
		}
		for(var o = 0; o < particle.ps.length; o += 1) {
			var p = particle.ps[o];
			this.batches[p.spriteid].AddCentered(p.x, p.y,
							   256/2, 256/2,
			                   p.r)
		}
	}

	for (var i = 0; i < this.batches.length; i += 1) {
		this.batches[i].End();
	}

	for(var i = 0; i < remove.length; i += 1) {
		console.log("Removing particle " + i);
		this.particles.splice(this.particles.indexOf(remove[i]), 1);
	}

}

ParticleRunner.prototype.draw = function( camera ) {
	var camera_view = camera.get_screen_coords();
	    camera_view = { s : camera_view[0][0], e : camera_view[1][0] };
	var camera_pmtx = camera.get_projection(); //--mat4.ortho( 0, 200, 0, 100, -1, 1 )
	// var camera_pmtx = mat4.ortho( -1, 1, -1, 1, -1, 1 );
	var camera_vmtx = camera.get_transform(); //--mat4.identity()

	mat4.inverse(camera_vmtx);

	for (var i = 0; i < this.textures.length; i += 1) {
		var tex = this.textures[i];
		var v = this.batches[i];
		var shader = this.shader;

	 	shader.Bind();	

		shader.SetUniform("pmtx", camera_pmtx );
		shader.SetUniform("vmtx", camera_vmtx );
		shader.SetUniform("mmtx", mat4.identity() );

		shader.SetUniform("tex0", 0 );
		shader.SetUniform("tex_size", [ tex.width, tex.height ] );
		tex.Bind( 0 );

		v.BindBuffers( shader, { position : true, uv0 : true });
		v.DrawBuffers( shader );
		v.UnbindBuffers( shader, {position : true, uv0 : true });
		shader.Unbind();
	}
}