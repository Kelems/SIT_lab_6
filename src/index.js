const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "lab",
  password: "123",
  port: "5432"
});

app.get("/", (req, res) => {
  res.send("home page");
});

pool
  .query("SELECT * FROM student")
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

app.use(express.json());

app.get("/student", async (req, res) => {
  const all_student = await pool.query("SELECT * FROM student");
  res.json(all_student.rows);
});

app.get("/student/:id", async (req, res) => {
  const id = req.params.id;
  const one_student = await pool.query("SELECT * FROM student WHERE id = $1", [
    id
  ]);
  res.json(one_student.rows[0]);
});

app.post("/student", async (req, res) => {
  const { fist_name, last_name, group, created, updated } = req.body;
  const new_student = await pool.query(
    "INSERT INTO student VALUES ($1, $2, $3, $4, $5)",
    [fist_name, last_name, group, created, updated]
  );
  res.json(new_student.rows[0]);

  const all_student = await pool.query("SELECT * FROM student");
  res.json(all_student.rows);
});

app.put("/student/:id", async (req, res) => {
  const id = req.params.id;
  const updated = new Date();
  const { fist_name, last_name, group } = req.body;
  const update_student = await pool.query(
    "UPDATE student SET first_name = $1, last_name = $2, group = $3, updated = $4 WHERE id = $5",
    [fist_name, last_name, group, updated, id]
  );
  res.json(update_student.rows[0]);

  const all_student = await pool.query("SELECT * FROM student");
  res.json(all_student.rows);
});

app.delete("student/:id", async (req, res) => {
  const id = req.params.id;
  const delete_student = await pool.query("DELETE FROM student WHERE id = $1", [
    id
  ]);
  res.json(delete_student.rows[0]);

  const all_student = await pool.query("SELECT * FROM student");
  res.json(all_student.rows);
});
