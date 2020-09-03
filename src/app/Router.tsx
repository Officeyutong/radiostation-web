import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Modify from "./pages/Modify"
const router: React.FC<{}> = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/modify" component={Modify}></Route>

        </Switch>
    </Router>
);

export default router;