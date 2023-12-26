import React from "react";
import Notes from "./Notes";
import Alert from "./Alert";

const Home = (props) => {
const {showAlert} = props;
  return (
    <div className="container">
      <Notes showAlert={showAlert}/>
    </div>
  );
};

export default Home;
