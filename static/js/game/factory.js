Factory = function(type) {
    // create new factory object
    var c = { proto : {type : type}};

    // new emits new objects of factory type
    c.new = function()
    {
        var o = { uid : guid(this.proto.type) };

        // extend object with factory properties
        for ( var proto in this.proto )
            o[proto] = deepcopy( this.proto[proto] );

        if ( o.init ) o.init.apply( o, arguments );

        return o;
    };

    // putta in lite skräp i fabriken
    c.insert = function( component )
    {
        extend(this.proto, component);

        return this;
    };

    var _components = Array.prototype.slice.call(arguments,1);

    for ( var _cix in _components )
    {
        c.insert( _components[_cix] );
    };

    return c;
};
