import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { authenticate, isAuth } from "./helpers";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/Layout";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit"
  });

  const { email, password, buttonText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password }
    })
      .then(response => {
        console.log("SIGN-IN SUCCESS", response);
        authenticate(response, () => {
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Submitted"
          });
          toast.success(`Welcome back, ${response.data.user.name}!`);
        });
      })
      .catch(error => {
        console.log("SIGN-IN ERROR", error.response.data);
        setValues({
          ...values,
          buttonText: "Submit"
        });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <table className="text-muted">Email</table>
        <input
          onChange={handleChange("email")}
          type="text"
          value={email}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <table className="text-muted">Password</table>
        <input
          onChange={handleChange("password")}
          type="password"
          value={password}
          className="form-control"
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1>Signin</h1>
        {signinForm()}
      </div>
    </Layout>
  );
};

export default Signin;
