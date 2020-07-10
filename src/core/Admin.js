import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { isAuth, getCookie, signout, updateUser } from "../auth/helpers";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/Layout";

const Admin = ({ history }) => {
  const [values, setValues] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
    buttonText: "Submit"
  });

  const token = getCookie("token_mernauth");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch(error => {
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };

  const { name, role, email, password, buttonText } = values;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { name, password }
    })
      .then(response => {
        console.log("PROFILE UPDATE FORM SUCCESS", response);
        updateUser(response, () => {
          setValues({
            ...values,
            buttonText: "Submitted"
          });
          toast.success("Profile updated successfully");
        });
      })
      .catch(error => {
        console.log("PROFILE UPDATE FORM ERROR", error.response.data.error);
        setValues({
          ...values,
          buttonText: "Submit"
        });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input
          type="text"
          defaultValue={role}
          className="form-control"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="text"
          defaultValue={email}
          className="form-control"
          disabled
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
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
        <h1 className="p-5 text-center">Admin</h1>
        <p className="lead text-center">Profile Update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;
