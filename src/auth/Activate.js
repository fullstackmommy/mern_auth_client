import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jsonwebtoken";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/Layout";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setValues({ ...values, name, token });
    }
  }, [match.params.token, values]);

  const { name, token, show } = values;

  const handleSubmit = event => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token }
    })
      .then(response => {
        console.log("ACCOUNT ACTIVATION", response);
        setValues({
          ...values,
          show: false
        });
        toast.success(response.data.message);
      })
      .catch(error => {
        console.log("ACCOUNT ACTIVATION ERROR", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-5">Hi, {name}! Ready to activate your account?</h1>
      <button className="btn btn-outline-primary" onClick={handleSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
