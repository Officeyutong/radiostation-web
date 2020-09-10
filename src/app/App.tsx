import React from 'react';
import Router from "./Router";
import 'semantic-ui-css/semantic.min.css'
import axios from "axios";
import { show } from "./dialogs/Dialog";
import { Container } from "semantic-ui-react";
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
  return <div>
    <Router></Router>
    <Container textAlign="center">
      <div style={{ color: "grey" }}>
        By MikuNotFoundException<br></br>
        <a href="https://github.com/Officeyutong/radiostation-web" target="_blank" rel="noopener noreferrer" >https://github.com/Officeyutong/radiostation-web</a><br></br>
      Made with Love and React<br></br>
      In memory of the past high school days<br></br>

      </div>
    </Container>
  </div>;
}
export default App;
