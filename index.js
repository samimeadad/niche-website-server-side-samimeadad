const express = require( 'express' );
require( 'dotenv' ).config();
const cors = require( 'cors' );
const app = express();
const port = 5001;

//middleware
app.use( cors() );
app.use( express.json() );

app.get( '/', ( req, res ) => {
    res.send( 'Hello World! Niche Product Server Side App is running successfully' );
} )

app.listen( port, () => {
    console.log( `Niche Product Website Server App listening at http://localhost:${ port }` );
} )