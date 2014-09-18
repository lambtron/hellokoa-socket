
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


// Serve the frontend
app.use( serve( path.join( __dirname, '../public' ) ) );


// Handle socket events
socket.on( 'event', function( packet ) {
    console.log( 'Socket received packet\n', packet );
});


/**
 * Create web socket connected server
 */
app.server = http.createServer( app.callback() );
app.io = socketIO( app.server );

// Connect the socket to koa-socket
app.io.on( 'connection', function( sock ) {
    console.log( 'Socket connected', sock.id );
    app.socket = socket.attach( sock );
});


// Export server, all ready to start listening
module.exports = app.server;

// Expose composable app
exports.app = app;

// Expose the socket
exports.io = app.io;
