import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();
  let dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    console.log(localStorage.getItem("emailForRegisteration"));
    console.log(window.location.href);
    setEmail(localStorage.getItem("emailForRegisteration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    try {
      // window.location.href is url
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        // remove the email from localStorage
        localStorage.removeItem("emailForRegisteration");
        // get user id token
        // firebase auth keeps track of user status
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        // redux store

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
        // redirect
        history.push("/");
      }
      console.log("RESULT", result);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeRegisterationForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email"
        className="form-control"
        value={email}
        disabled
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="form-control mt-4"
        value={password}
        autoFocus
      />
      <button type="submit" className="btn btn-primary mt-4">
        Complete Registeration
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>

          {completeRegisterationForm()}
        </div>
        <div className="col-md-6 offset-md-3"></div>
      </div>
    </div>
  );
};

export default RegisterComplete;
