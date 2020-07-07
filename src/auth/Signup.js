import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "../core/Layout";

const Signup = () => {
  return (
    <Layout>
      <ToastContainer />
      <h1>Signup</h1>
    </Layout>
  );
};

export default Signup;
