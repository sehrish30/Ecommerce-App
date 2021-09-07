import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import { API } from "../config";

export const axiosPublic = axios.create({
  baseURL: API,
});

export const axiosAuth = axios.create({
  baseURL: API,
});

axiosAuth.interceptors.request.use(
  async (config) => {
    let user = await firebase.auth().currentUser;
    config.headers.authtoken = user ? await user.getIdToken() : "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
