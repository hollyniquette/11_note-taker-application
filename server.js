import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid as nanoId } from "nanoid";
import fs from "fs";

const app = express();

/* target public folder for client files */
app.use(express.static("public"));
app.use(express.json());

const port = process.env.PORT || 3001;

/* __dirname fix for ES6 modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* sends index.html to client */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

/* sends notes.html to client */
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

/* instantiate listener */
app.listen(port, () =>
  console.log(`Note Taker server listening at http://localhost:${port}`)
);

/* load notes from db.json */
app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"))
  );
  res.status(200).json(notes);
});

/* add new note to db.json */
app.post("/api/notes", (req, res) => {
  let note = req.body;
  const existingNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"))
  );
  note.id = nanoId();
  existingNotes.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(existingNotes)
  );
  res.status(200).json("Note added!");
});

/* delete note from db.json */
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const existingNotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"))
  );
  const filteredNotes = existingNotes.filter((note) => note.id !== id);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(filteredNotes)
  );
  res.status(200).json("Note deleted!");
});
