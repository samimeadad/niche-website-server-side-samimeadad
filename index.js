require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const port = process.env.PORT || 5001;
const cors = require( 'cors' );
const ObjectId = require( 'mongodb' ).ObjectId;

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

        //Create the database
        const database = client.db( "watchYourWrist" );

        //Create the collections
        const watchesCollection = database.collection( "watches" );
        const reviewsCollection = database.collection( "reviews" );
        const ordersCollection = database.collection( "orders" );
        const usersCollection = database.collection( "users" );

        //GET Watches API (Send all watches information to the client)
        app.get( '/watches', async ( req, res ) => {
            const cursor = watchesCollection.find( {} );
            const watches = await cursor.toArray();
            res.send( watches );
        } );

        //GET Reviews API (Send all reviews information to the client)
        app.get( '/reviews', async ( req, res ) => {
            const cursor = reviewsCollection.find( {} );
            const reviews = await cursor.toArray();
            res.send( reviews );
        } );

        //GET Orders API (Send all orders information to the client)
        app.get( '/orders', async ( req, res ) => {
            const cursor = ordersCollection.find( {} );
            const orders = await cursor.toArray();
            res.send( orders );
        } );

        //GET Users API (Send all users information to the client)
        app.get( '/users', async ( req, res ) => {
            const cursor = usersCollection.find( {} );
            const users = await cursor.toArray();
            res.send( users );
        } );

        //POST API (Add a Order)
        app.post( '/orders', async ( req, res ) => {
            const order = req.body;
            const result = await ordersCollection.insertOne( order );
            res.json( result );
        } );

        //POST API (Add a User with email/password)
        app.post( '/users', async ( req, res ) => {
            const user = req.body;
            const result = await usersCollection.insertOne( user );
            console.log( result );
            res.json( result );
        } )

        //POST API (Update/Insert-upsert the User with Google Login)
        app.put( '/users', async ( req, res ) => {
            const user = req.body;
            const query = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne( query, updateDoc, options );
            res.json( result );
        } )

        //POST API (Add a Review)
        app.post( '/reviews', async ( req, res ) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne( review );
            res.json( result );
        } );

        //DELETE an Order API
        app.delete( '/orders/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await ordersCollection.deleteOne( query );
            res.json( result );
        } );

        //GET API (Get user information to check if the user is an admin)
        app.get( '/users/:email', async ( req, res ) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne( query );
            let isAdmin = false;
            if ( user?.role === 'admin' ) {
                isAdmin = true;
            }
            res.json( { admin: isAdmin } );
        } )

        //UPDATE API (Update a user to make him/her an admin)
        app.put( '/users', async ( req, res ) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if ( requester ) {
                const requesterAccount = await usersCollection.findOne( { email: requester } );

                if ( requesterAccount.role === 'admin' ) {
                    const query = { email: user.email };
                    const updateDoc = {
                        $set: {
                            role: 'admin'
                        }
                    };
                    const result = await usersCollection.updateOne( query, updateDoc );
                    res.json( result );
                }
            }
            else {
                res.status( 403 ).json( { error: 'You don not have authority to make admin' } );
            }
        } )

        //POST API (Add a Watch)
        app.post( '/watches', async ( req, res ) => {
            const watch = req.body;
            const result = await watchesCollection.insertOne( watch );
            res.json( result );
        } );


        //UPDATE API (Update the order status to Shipped)
        app.put( '/orders/:id', async ( req, res ) => {
            const orderId = req.params.id;
            const updateOrder = req.body;
            const query = { _id: ObjectId( orderId ) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status
                },
            };
            const result = await ordersCollection.updateOne( query, updateDoc, options );
            res.json( result );
        } );

        //DELETE a Watch API
        app.delete( '/watches/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await watchesCollection.deleteOne( query );
            res.json( result );
        } );
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