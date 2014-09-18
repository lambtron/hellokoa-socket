
var app = require( './lib/server' );

app.listen( process.env.PORT || 14320 );
console.log( 'Listening on port', process.env.PORT || '14320' );

// var server = require( 'http' ).Server( app.callback() );
// var io = require( 'socket.io' )( server );
//
//
// io.on( 'connection', function( socket ) {
//     console.log( 'Socket connected', new Date().toTimeString() );
//
//     socket.on( 'event', function( packet ) {
//         console.log( 'Socket received event packet\n', packet );
//
//         socket.emit( 'response', {
//             body: {
//                 status: 200,
//                 text: 'All OK'
//             }
//         });
//     });
//
//     socket.on( 'disconnect', function() {
//         console.log( 'Socket disconnected', new Date().toTimeString() );
//     });
// });
//
// server.listen( process.env.PORT || 14320 );
// console.log( 'Listening on port', process.env.PORT || '14320' );
