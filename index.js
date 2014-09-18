
var app = require( './lib/server' );

app.listen( process.env.PORT || 14320 );
console.log( 'Listening on port', process.env.PORT || '14320' );
