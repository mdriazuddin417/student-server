const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://clenaCo:B2ylUSF3jWicjcUQ@cluster0.jjz96.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client.db("allStudent").collection("students");

    //Get Student
    app.get("/students", async (req, res) => {
      const result = await studentCollection.find({}).toArray();
      res.send(result);
    });

    //Get Single Student
    app.get("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentCollection.findOne(query);
      res.send(result);
    });

    app.get("/student", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = studentCollection.find(query);
      let result;
      if (page || size) {
        result = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await cursor.toArray();
      }

      res.send(result);
    });

    app.get("/productCount", async (req, res) => {
      const count = await studentCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //Post Student

    app.post("/student", async (req, res) => {
      const data = req.body;
      const result = await studentCollection.insertOne(data);
      res.send(result);
    });

    //Update Student

    app.put("/student/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: { ...data } };
      const option = { upsert: true };
      const result = await studentCollection.updateOne(
        filter,
        updateDoc,
        option,
      );
      res.send(result);
    });

    //Delete Student
    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello , This is Student server");
});

app.listen(port, () => {
  console.log("Server check port ", port);
});
