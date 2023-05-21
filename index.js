const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.USER_DB);





const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.qpp2kyl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // collection
        const allToyCollection = client.db('Allrobot').collection('robot');

        app.get('/robot', async (req, res) => {
            const cursor = allToyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // update toy
        app.get('/robot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: {
                    title: 1, price: 1, name: 1
                }
            }
            const result = await allToyCollection.findOne(query, options);
            res.send(result);

        })
        // sub-category
        app.get("/sub-category", async (req, res) => {
            const CategoryName = req.query?.category
            const subToy = await allToyCollection.find({
                sub_category: CategoryName
            }).toArray()
            const result = {
                category_name: CategoryName,
                subToy
            }

            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('simple toy shop is running')
})
app.listen(port, () => {
    console.log(`simple toy shop is running on port,${port}`);
})
