import React, {useState} from "react";


const Signup = (props) => {
    const [credentials, setCredentials]= useState({name:"",email:"", password:""})

    const onChange=(e)=>{
        //Spread operator
        //make the name of whatever changes equal to its value
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name:credentials.name,email: credentials.email, password: credentials.password}), 
          });
          const json= await response.json();
          console.log(json);
            localStorage.setItem('token', json.authtoken);
          props.showAlert("Signup Successful","success")
          
    }
  return (
    
    <div className="container">
       <form onSubmit={handleSubmit}>
       <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"name="name" onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email" name="email" onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password" name="password"
            className="form-control"
            id="password" onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword" name="cpassword" onChange={onChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          SignUp
        </button>
      </form>
    </div>
  );
};

export default Signup;
