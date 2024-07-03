const express =require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
require('dotenv').config()
const cors =require('cors');
const port =process.env.PORT || 5300;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.bescutn.mongodb.net/?retryWrites=true&w=majority`;

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
  
    const taskCollection = client.db("taskManagement").collection("tasks");
 
    //post related api
    app.get('/tasks',async(req,res)=>{
 
        const result= await taskCollection.find().toArray(); 
        res.send(result);
    })
    app.get('/tasks/:email', async (req, res) => {
      const query = { email: req.params.email }
      if (req.params.email !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/tasks', async (req, res) => {
        const item = req.body;
        const result = await taskCollection.insertOne(item);
        console.log(result)
        res.send(result);
      });
      app.delete('/tasks/:id',async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      })
      app.patch('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            isCompleted: 'true'
          }
        }
        const result = await taskCollection.updateOne(filter, updatedDoc);
        res.send(result);
      })
   
  } finally {
    
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('task is running');

})
app.listen(port,()=>{
    console.log(`task is sitting on port ${port}`);
})