import React from 'react';
import Router from "./Router";
import 'semantic-ui-css/semantic.min.css'
import axios from "axios";
import { show } from "./dialogs/Dialog";
const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;
console.log(BACKEND_BASE_URL);

axios.defaults.baseURL = BACKEND_BASE_URL;
axios.interceptors.response.use(resp => {
  return resp;
}, err => {
  console.log(err);
  let resp = err.response;
  console.log(resp);
  if (resp)
    show(resp.data, resp.status + " " + resp.statusText, true);
  else
    show(String(err), "发生错误", true);
});
const App: React.FC<{}> = () => {
  return <Router></Router>;
}
export default App;
