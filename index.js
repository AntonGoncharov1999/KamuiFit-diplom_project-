var express = require( 'express' ),
	app = express();

app.get( "/", function (req, res) {
	res.send( "Hell World" )
} );


// start server
app.listen( 3000, function () {
	global.console.log('Work on port: 3000!')
});