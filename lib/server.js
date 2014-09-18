
var path        = require( 'path' ),
    http        = require( 'http' ),

    koa         = require( 'koa' ),
    logger      = require( 'koa-logger' ),
    serve       = require( 'koa-static' ),
    route       = require( 'koa-route' ),
    socketIO    = require( 'socket.io' ),

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


// Serve the frontend
app.use( serve( path.join( __dirname, '../public' ) ) );


// Export composable app
// exports.app = app;
//
// // Export start function to spin up web sockets
// exports.start = function( port ) {
//     var server = http.createServer( app.callback() );
//     var io = socketIO( server );
// }

function listeners( socket ) {
    socket.on( 'event', function( packet ) {
        console.log( 'Socket received packet\n', packet );
    });
}


var Sprocket = function( socket, listener ) {
    listeners( socket );
}


var koaSocket = {
    listener: null,

    use: function( listener ) {
        this.listener = listener;
    },

    attach: function( socket ) {
        return new Sprocket( socket, this.listener );
    }
}



koaSocket.use( listeners );



var server = http.createServer( app.callback() );
var io = socketIO( server );

io.on( 'connection', function( socket ) {
    console.log( 'Socket connected', socket.id );
    app.socket = koaSocket.attach( socket );
});


module.exports = server;
