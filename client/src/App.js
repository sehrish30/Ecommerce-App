import { Switch, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterComplete from "./pages/auth/RegisterComplete";
import History from "./pages/user/History";
import Wishlist from "./pages/user/Wishlist";
import Password from "./pages/user/Password";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";

import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";

import { currentUser } from "./functions/auth";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";

function App() {
  const dispatch = useDispatch();
  // check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // make sure we have user
      console.log(user);
      if (user) {
        // return JWT token
        const idTokenResult = await user.getIdTokenResult();
        // dispatch token to redux
        // backend validate this token its generated by firebase and belongs to the user
        currentUser(idTokenResult.token)
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
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <>
      <Header />
      <ToastContainer />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        {/* protected routes */}
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/user/password" component={Password} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/sub" component={SubCreate} />
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
      </Switch>
    </>
  );
}

export default App;
