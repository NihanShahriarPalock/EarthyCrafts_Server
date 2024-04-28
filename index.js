const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lggq9by.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const craftsCollection = client.db("CraftsDB").collection("Crafts");

        app.get('/AllArtAndCraft', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        app.get('/MyCraft/:email', async (req, res) => {

            const result = await craftsCollection.find({ email: req.params.email }).toArray()
            res.send(result)
            // console.log(req.params.email);
        })


        app.get('/singleCraft/:id', async (req, res) => {
            const result = await craftsCollection.findOne({ _id: new ObjectId(req.params.id), })
            // console.log(result);
            res.send(result)
        })


        app.post('/addcraft', async (req, res) => {
            const newCraft = req.body;
            // console.log(newCraft);
            const result = await craftsCollection.insertOne(newCraft)
            res.send(result)

        })

       
        app.put("/updateCraft/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const data = {
                $set: {
                    price: req.body.price,
                    rating: req.body.rating,
                    item_name: req.body.item_name,
                    subcategory_Name: req.body.subcategory_Name,
                    short_description: req.body.short_description,
                    image: req.body.image,
                    processing_time: req.body.processing_time,
                    customization: req.body.customization,
                    stockStatus: req.body.stockStatus,

                }
            }
            const result = await craftsCollection.updateOne(query, data)
            console.log(result);
            res.send(result)
        })

        app.delete('/MyCraft/:id', async (req, res) => {
            const result = await craftsCollection.deleteOne({ _id: new ObjectId(req.params.id), })
            // console.log(result);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
