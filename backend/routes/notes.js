const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
//Route 1: get all notes using : GET "/api/notes/fetchallnotes" //login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({"Error":"error"});
  }
});

//Route 2: add a new note using : POST "/api/notes/addnote" // login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a longer title").isLength({ min: 3 }),
    body("description", "Description must atleast be 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //returning bad request if error
        return res.status(400).json({ errors: errors.array() });
      }
      //create new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({"Error":"error"});
    }
  }
);

//Route 3: update a note using : PUT "/api/notes/updatenote/:id" // login required
router.put(
    "/updatenote/:id",
    fetchUser, async (req, res) => {
      try {
        const { title, description, tag } = req.body;
        //create a new note object
        const newNote={};
        if(title){newNote.title= title};
        if(description){newNote.description= description};
        if(tag){newNote.tag= tag};

        //find the note to be updated
        let note= await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Update not allowed");
        }
        note= await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{ new:true})
        res.json(note);
      } catch (error) {
        console.error(error.message);
        res.status(500).send({"Error":"error"});
      }
    }
  );

  //Route 4: delete a note using : DELETE "/api/notes/deletenote/:id" // login required
  router.delete(
    "/deletenote/:id",
    fetchUser, async (req, res) => {
      try {

        //find the note to be deleted
        let note= await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
        //Allow deletion if only user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Deletion not allowed");
        }
        note= await Note.findByIdAndDelete(req.params.id)
        res.json("Success, Note has been deleted");
      } catch (error) {
        console.error(error.message);
        res.status(500).send({"Error":"error"});
      }
    }
  );
module.exports = router;
