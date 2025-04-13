const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

let cachedClient = null;

async function connect() {
    if (cachedClient) return cachedClient;
    try {
        cachedClient = await MongoClient.connect('mongodb+srv://geekysharma31:eb1ro39Dc1lomf0u@cluster0.ofkby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
        return cachedClient;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

connect()

app.get('/',(req,res)=>{
    res.send('working')
})

app.post('/adduser', async (req, res) => {
    const data = req.body
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");

        const result = await collection.insertOne(data)
        res.send(result.insertedId.toString())
    } catch (e) {
        // console.log(e)
        res.status(500).json({ message: 'Error' })
    }
})

app.get('/lg/:id', async (req, res) => {
    const id = req.params.id
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const query = { _id: new ObjectId(id) }
        const cursor = collection.find(query)
        const results = await cursor.toArray()

        res.send(results[0].lg)
    } catch (e) {
        res.send(e)
    }
})

app.put('/lg/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body.lg

    console.log(data)

    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const updateResult = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { lg: data } })
        if (updateResult.modifiedCount === 1) {
            res.send(true)
        } else {
            res.send(false)
        }
    } catch (err) {
        console.error(err)
        res.status(500)
    }

})

app.get('/topics/:id', async (req, res) => {
    const id = req.params.id
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const query = { _id: new ObjectId(id) }
        const cursor = collection.find(query)
        const results = await cursor.toArray()

        res.send(results[0].topics)
    } catch (e) {
        res.send(e)
    }
})

app.get("/leads",async (req,res)=>{
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const cursor = collection.find({}, { projection: { lg: 1, email: 1, fname: 1 } }).sort({ lg: -1 }).limit(10);
        const results = await cursor.toArray()
        res.send(results)
    } catch (e) {
        res.send(e)
    }
})

app.put('/topics/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const updateResult = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { topics: data } })
        if (updateResult.modifiedCount === 1) {
            res.send(true)
        } else {
            res.send(false)
        }
    } catch (err) {
        console.error(err)
        res.status(500)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const query = { email: email }
        const cursor = collection.find(query)
        const results = await cursor.toArray()

        if (results.length) {
            if (password === results[0].password) {
                results[0]._id = results[0]._id.toString()
                res.send(results[0])
            }
            else
                res.send('pass')
        } else {
            res.send('email')
        }


    } catch (err) {
        console.error(err)
        res.status(500)
    }
})

app.get('/user/:id', async (req, res) => {
    var id = req.params.id
    try {
        const client = await connect();
        const db = client.db("users");
        const collection = db.collection("users");
        const query = { _id: new ObjectId(id) }
        const cursor = collection.find(query)
        const results = await cursor.toArray()
        res.send(results[0].lg)
    } catch (e) {
        // console.log(e)
    }
})

app.listen(port, () => {
    console.log('Listening at port ' + port)
})

