import React, { useEffect , useRef} from "react";
import { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";

const Notes = (props) => {
  const onChange=(e)=>{
    //Spread operator
    //make the name of whatever changes equal to its value
    setNote({...note, [e.target.name]:e.target.value})
}
const [note, setNote]= useState({id:"",etitle:"", edescription:"", etag:""})
const handleSubmit=(e)=>{
  console.log("updating", note);
  editNote(note.id, note.etitle, note.edescription, note.etag);
  refClose.current.click();

}
  const context = useContext(noteContext);
  const { notes, getNotes, editNote} = context;
  useEffect(() => {
    getNotes();
  }, []);
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id:currentNote._id,
      etitle: currentNote.title || '',
      edescription: currentNote.description || '',
      etag: currentNote.tag || ''
    })
    props.showAlert("Updated Successfully", "success")
  };
  const ref= useRef(null)
  const refClose= useRef(null)
  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal" 
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <form className="my-3">
        <div className="mb-3">
          <label htmlFor="etitle" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="etitle"
            id="etitle" value= {note.etitle}
            aria-describedby="emailHelp" onChange={onChange} minLength={3} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="edescription" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="edescription" 
            name="edescription" value= {note.edescription}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="etag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control" 
            id="etag" 
            name="etag" value= {note.etag}
            onChange={onChange} minLength={5} required
          />
        </div>
            </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref= {refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button onClick={handleSubmit} type="button" className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h1>Your notes</h1>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
