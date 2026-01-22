const express = require('express');
const cors = require('cors');
const mysql = require("mysql2");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true }));

const connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "to_do_app"
});

connectDB.connect((error) => {
  if (error) {
    console.log("Database undefined");
  } else {
    console.log("Database connected successfully");
  }
});

app.post("/tasks", (req, res) => {

    const query = "INSERT INTO tasks(`task`, `due_date`) VALUES(?)";
    const values = [
      req.body.taskInput,
      req.body.taskDateInput
    ];

    connectDB.query(query, [values], (error, data) => {
        if(error) {
            return res.json(error)
        }
        else{
            return res.json(data);
        }
    })
});

app.get("/tasks", (req, res) => {
  const query = "SELECT * FROM tasks";

  connectDB.query(query, (err, data) => {
    if(err){
      return res.json(err)
    }else{
      return res.json(data)
    }
  })
})


app.delete("/delete/:id", (req, res) => {
  const query = "DELETE FROM tasks WHERE id = ?";

  const id = req.params.id;

  connectDB.query(query, [id], (err, data) => {
    if (err) return res.json("Server error");
    return res.json(data);
  });
});

app.get("/edit/:id", (req, res) => {
  const query = "SELECT * FROM tasks WHERE id = ?";
  const id = req.params.id;

  connectDB.query(query, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data); // data هو array
  });
});

app.put("/edit/:id", (req, res) => {
  const query = "UPDATE tasks SET task = ?, due_date  = ? WHERE id =?";

  const id = req.params.id;

  connectDB.query(query, [req.body.taskInput, req.body.taskDateInput, id], (err, data) => {
    if(err) return res.json(err);
    return res.json(data)
  })
})

app.listen(3080, () => {
    console.log("The server is runing in port 3080");
})