
var path        = require( 'path' ),
    http        = require( 'http' ),

    koa         = require( 'koa' ),
    logger      = require( 'koa-logger' ),
    serve       = require( 'koa-static' ),
    route       = require( 'koa-route' ),
    socketIO    = require( 'socket.io' ),
    socket      = require( 'koa-socket' ),

    render      = require( './util/views' ),

    app;


app = koa();

app.use( logger() );


// Custom 404
app.use( function *( next ) {
    yield next;

    if ( this.body || !this.idempotent ) {
        return;
    }

    this.status = 404;
    this.body = yield render( '404' );
});


// Route to test emitting socket event to all connections
app.use( route.get( '/emit', function *( next ) {
    console.log( 'Get emit route:', 'sending response event to all sockets' );

    app.io.emit( 'response', {
        howdy: 'koa'
    });
}));


// Return some info from the koa-socket instance
app.use( route.get( '/socket', function *( next ) {
    var connections = [];

    socket.getConnections().forEach( function( connection ) {
        connections.push( connection.id );
    });

    this.body = {
        connections: socket.numConnections,
        sockets: connections
    }
}));


// Serve the frontend
app.use( serve( path.join( __dirname, '../public' ) ) );


// Start a server listening
socket.start( app );


// Handle socket events
socket.on( 'event', function( packet ) {
    console.log( 'Socket received packet\n', packet );
    // console.log( 'this:', this );
});


// Add socket middleware
socket.use( function *( next ) {
    console.log( 'Socket event received from', this.socket.id );
    console.log( 'Manipulating packet' );

    var start = new Date();
    yield next;

    if ( typeof this.data === 'object' ) {
        this.data.mw = this.data.mw.concat( ' 1st middleware done' );
    }

    var time = new Date() - start;
    console.log( 'Socket middleware duration:', time );
});

// Test middleware cascade
socket.use( function *( next ) {
    if ( typeof this.data === 'object' ) {
        this.data.mw = '2nd middleware done';
    }
});


// Export server, all ready to start listening
module.exports = app.server;

// Expose composable app
exports.app = app;

// Expose the socket
exports.io = app.io;
