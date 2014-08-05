/***************************************	
*	public
*	--------
*	"3d viewer" screen that renders
*   a scene from a camera
*
****************************************/
porcupine.templates.viewer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);

	/***************************************	
	* 	default viewer config
	*     background_color : sets clear color
	*     clear : perform clear or not
	****************************************/
	var config_default = {
		background_color : [ 0,0,0,1.0 ],
		clear : true,
		do_culling : true,
		draw_debugspheres : false
	};

	extend( screen, config_default );
	extend( screen, config );

	screen.init = function( instance )
	{
		this.shader  = this.shader || instance.ctx.Shaderlib.forward;
	};

	screen.update = function( instance, dt, vis )
	{
		var ctx = this.instance.ctx;

		// update camera matrices and frustrum properties
        this.camera.Update(dt);

        // update scene objects
        instance.ctx.UpdateObjects( this.scene, dt );
	};

	screen.visitor = function( name, node, depth )
	{
		if ( node.type == "mesh" )
		{
			var isVisible = true;

			if ( !node.boundingVolume )
					node.UpdateBoundingVolume();

			if ( this.do_culling )
			{
				isVisible = node.IsVisible(this.camera);
			};

			if ( node.boundingVolume )
				this.drawspheres.push( node.boundingVolume );

			if ( isVisible )
			{
				var mvmat = mat4.create();
				mat4.multiply( this.camera.invworldtransform, node.worldtransform, mvmat );

				var uniforms = {};
				uniforms.uMVMatrix = mvmat;

				if ( node.material )
				{
					var mat = node.material;

					/*
					if ( typeof mat.diffusemap == "string" )
					{
						if ( this.scene.textures[mat.diffusemap] && this.scene.textures[mat.diffusemap].load )
							 this.scene.textures[mat.diffusemap].load();
					} else ;*/

					uniforms.tex0 = mat.diffusemap;
				}

				this.shader.SetUniforms( uniforms );

				node.Draw( this.shader );
			};
		};
		
	};

	screen.draw = function( instance, vis )
	{
		this.drawspheres = [];

		var gl = instance.ctx.gl;

		gl.viewport( 0,0,instance.settings.width, instance.settings.height );

		if ( this.clear )
		{
			gl.clearColor.apply( gl, this.background_color );
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		};

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		if ( this.camera && this.scene )
		{
			this.shader.Bind();
			this.shader.SetUniform("uPMatrix", this.camera.pMatrix );
			this.shader.SetUniform("uNMatrix", this.camera.invnormaltransform );

			this.shader.SetUniforms(this.uniforms);

			this.scene.Walk( this.visitor.bind(this) );
		}

		if ( this.draw_debugspheres )
		{
            gl.enable( gl.BLEND );
            gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
            gl.disable(gl.DEPTH_TEST);
            gl.disable( gl.CULL_FACE );
            // gl.blendColor( 1,1,1,0.25 );

            var shader = instance.ctx.Shaderlib.forwardSolidColor;
            
            shader.Bind();
            this.spheregeo.BindBuffers( shader, { position : true, uv0 : false, normal : true } );

            shader.SetUniform( "uPMatrix", this.camera.pMatrix );
            shader.SetUniform( "color", [0.25,0.25,0.25,0.05] );

            for (var i = this.drawspheres.length - 1; i >= 0; i--) {
                var smat = mat4.identity();
                var r    = this.drawspheres[i].radius;

                mat4.translate( smat, this.drawspheres[i].center, smat );
                //mat4.translate( smat, vec3.create(), smat );
                mat4.scale( smat, [r,r,r] , smat );

                var mvmat = mat4.create();
				mat4.multiply( this.camera.invworldtransform, smat, mvmat );

                // object to world matrix
                shader.SetUniform( "uMVMatrix", mvmat );

                this.spheregeo.DrawBuffers();
            };
            
            this.spheregeo.UnbindBuffers( shader, { position : true, uv0 : false, normal : true } );

            gl.disable(gl.BLEND);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            shader.Unbind();
        }

		this.shader.Unbind();
	};

	return screen;
};