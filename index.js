require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5001;
const cors = require( 'cors' );
// const ObjectId = require( 'mongodb' ).ObjectId;

//middleware
app.use( cors() );
app.use( express.json() );

const { MongoClient } = require( 'mongodb' );

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.iezc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

const run = async () => {
    try {
        await client.connect();
        console.log( 'database connected' );

        const database = client.db( "watchYourWrist" );
        const watchesCollection = database.collection( "watches" );
        const reviewsCollection = database.collection( "reviews" );
        // const ordersCollection = database.collection( "orders" );

        //GET Watches API
        app.get( '/watches', async ( req, res ) => {
            const cursor = watchesCollection.find( {} );
            const watches = await cursor.toArray();
            res.send( watches );
        } );

        //GET Reviews API
        app.get( '/reviews', async ( req, res ) => {
            const cursor = reviewsCollection.find( {} );
            const reviews = await cursor.toArray();
            res.send( reviews );
        } );

        //POST API (Add a Watch)
        // app.post( '/watches', async ( req, res ) => {
        //     const watch = req.body;
        //     const result = await watchesCollection.insertOne( watch );
        //     res.json( result );
        // } );

        //POST API (Add a Review)
        // app.post( '/reviews', async ( req, res ) => {
        //     const review = req.body;
        //     const result = await reviewsCollection.insertOne( review );
        //     res.json( result );
        // } );

        //POST API (Add a Order)
        // app.post( '/orders', async ( req, res ) => {
        //     const order = req.body;
        //     const result = await ordersCollection.insertOne( order );
        //     res.json( result );
        // } );

        //UPDATE Watch API
        // app.put( '/watches/:id', async ( req, res ) => {
        //     const watchId = req.params.id;
        //     const updateWatch = req.body;
        //     const query = { _id: ObjectId( watchId ) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             status: updateWatch.status
        //         },
        //     };

        //     const result = await watchesCollection.updateOne( query, updateDoc, options );
        //     res.json( result );
        // } );

        //DELETE a Watch API
        // app.delete( '/watches/:id', async ( req, res ) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId( id ) };
        //     const result = await watchesCollection.deleteOne( query );
        //     res.json( result );
        // } );
    }
    finally {
        // await client.close();
    }
}

run().catch( console.dir );


app.get( '/', ( req, res ) => {
    res.send( 'Hello World! Niche Product Server Side App is running successfully' );
} )

app.listen( port, () => {
    console.log( `Niche Product Website Server App listening at http://localhost:${ port }` );
} )