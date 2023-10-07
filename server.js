const express = require("express");

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5001;
const app = express();
const cors = require("cors");

const connectdb = require("./config/dbConnection");

const tasks = require("./models/tasks");
const { ObjectId } = require("mongodb");

app.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);
  await connectdb();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
//get all tasks
app.get("/", async (req, res) => {
  const data = await tasks.find();
  console.log(data);
  res.json(data);
  res.status(200);
});

//create new task
app.get("/tasks/:description", async (req, res) => {
  console.log("in send tasks");
  const contact = await tasks.create({
    description: req.params.description.toString().trim(),
    isCompleted: false,
    task_id: new ObjectId(),
  });

  res.json({ status: "success" }).status(201);
});

//Mark task completion
app.get("/tasksComplete/:id", async (req, res) => {
  console.log("in Complete tasks");
  const prevData = await tasks.findById(req.params.id);
  let newflag = prevData.isCompleted;
  const contact = await tasks.findByIdAndUpdate(
    { _id: req.params.id },
    {
      isCompleted: !newflag,
    }
  );
  res.json({ status: "success" }).status(201);
});

//Delete task
app.get("/tasksDelete/:id", async (req, res) => {
  console.log("in Delete Tasks");
  await tasks.findByIdAndDelete(req.params.id);
  res.json({ status: "success" }).status(201);
});
