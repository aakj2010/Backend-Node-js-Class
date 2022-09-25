const express = require("express")
const cors = require("cors")
const mongodb = require("mongodb")
const app = express()
const mongoClient = mongodb.MongoClient
const URL = "mongodb://localhost:27017"
const DB = "zenclass"

let users = [];

// Middleware
app.use(express.json())
app.use(cors({
    origin : 'http://localhost:3000'
    // origin:'https://sensational-pegasus-ea84cf.netlify.app'
}))


app.get("/home", function (req, res) {
    res.json([
        {
            name: "Person1",
            age: 21
        },
        {
            name: "Person2",
            age: 22
        },
        {
            name: "Person3",
            age: 23
        }
    ]);
});

app.get("/about", function (req, res) {
    res.json({ message: "About Success..." });
});


// get users
app.get("/users", function (req, res) {
    // let qParams = req.query
    // console.log(qParams);

    // let resUser = [] 
    // for(let i=parseInt(req.query.offset); i<parseInt(req.query.offset) + parseInt(req.query.limit);i++ ){
    //     if(users[index]){
    //         resUser.push(users[index])
    //     }
    // }

    res.json(users);
});

// Post Data
app.post("/user",async function (req, res) {

   try {
     // Step 1 : Create a Connection between Nodejs and MongoDb
     const connection = await mongoClient.connect(URL)

     // Step 2 : Select the db
     const db = connection.db(DB)
 
     // Step 3 : Select the Collections
     // Step 4 : Do the Operations (Create, Update, read, delete)
     await db.collection("users").insertOne(req.body)
 
     // Step 5 : Close the Connection
     await connection.close()
 
     res.status(200).json({message:"Data Inserted "})
   } catch (error) {
    //  If any error throw error
    res.status(500).json({message:"Something went Wrong"})
   }

    // console.log(req.body);
    // req.body.id = users.length + 1;
    // users.push(req.body);
    // res.json({ message: "User Created Successfully" });
});

// get data
app.get("/user/:id", function (req, res) {
    let userId = req.params.id;
    let user = users.find((item) => item.id == userId)
    console.log(user);
    if (user) {
        res.json(user)
    } else {
        res.json({ message: "User not found" })
    }
})


// Edit data
app.put("/user/:id", function (req, res) {
    let userId = req.params.id;
    let userIndex = users.findIndex((item) => item.id == userId);

    if (userIndex != -1) {
        Object.keys(req.body).forEach((item) => {
            users[userIndex][item] = req.body[item]
        })

        res.json({ message: "done" })
    } else {
        res.json({ message: "User Not found" })
    }

})


// Delete
app.delete("/user/:id", function (req, res) {
    let userId = req.params.id;
    let userIndex = users.findIndex((item) => item.id == userId);

    if (userIndex != -1) {
        users.splice(userIndex, 1);

        res.json({
            message: "User Deleted"
        })
    }else {
        res.json({
            message:"User Not found"
        })
    }
})




app.listen(process.env.PORT || 3000)