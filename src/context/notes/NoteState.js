import { useState } from "react";
import NoteContext from "./noteContext";
const NoteState= (props)=>{
  const host= "http://localhost:5000"
    const notesInitial= []
      const [notes, setNotes]= useState(notesInitial)
      //get all notes
      const getNotes=async ()=>{
        //api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU4MmJjODMzNjllZGYyZWE1OGNiOWU0In0sImlhdCI6MTcwMzA2Njc1NX0.ELWT3p_98H9tP9_ztLlbpPBM2oLScYNodMDLhvbiUao"
          } 
        });
        // const json= response.json();
        //logic to edit note
        const json = await response.json()
        console.log(json);
        setNotes(json)
      }

      //Add a note
      //api call
      const addNote=async (title, description, tag)=>{
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU4MmJjODMzNjllZGYyZWE1OGNiOWU0In0sImlhdCI6MTcwMzA2Njc1NX0.ELWT3p_98H9tP9_ztLlbpPBM2oLScYNodMDLhvbiUao"
          },
          body: JSON.stringify({title, description, tag}), 
        });
        const json= await response.json();
        console.log(json);
        setNotes(notes.concat(json));
      }

      //Delete a note
      const deleteNote= async(id)=>{
        //api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: "DELETE", 
          headers: {
            "Content-Type": "application/json",
            "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU4MmJjODMzNjllZGYyZWE1OGNiOWU0In0sImlhdCI6MTcwMzA2Njc1NX0.ELWT3p_98H9tP9_ztLlbpPBM2oLScYNodMDLhvbiUao"
          } 
        });
        const json= response.json();
        console.log(json);
        //logic to edit note
        const newNotes= notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes);
      }

      //Edit a note
      const editNote= async(id ,title, description, tag)=>{
        //api call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
            "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU4MmJjODMzNjllZGYyZWE1OGNiOWU0In0sImlhdCI6MTcwMzA2Njc1NX0.ELWT3p_98H9tP9_ztLlbpPBM2oLScYNodMDLhvbiUao"
          },
          body: JSON.stringify({title, description, tag}), 
        });
        const json= await response.json();
        let newNotes= JSON.parse(JSON.stringify(notes))
        //logic to edit note
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title=title;
            newNotes[index].description= description;
            newNotes[index].tag= tag;
            break;
          }

        }
        setNotes(newNotes);
      }

    return (
      
        <NoteContext.Provider value={{notes, addNote,deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;