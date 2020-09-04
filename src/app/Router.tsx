import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Modify from "./pages/Modify"
import Manage from "./pages/Manage";
const router: React.FC<{}> = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/modify" component={Modify}></Route>
            <Route exact path="/play_list" component={Manage}></Route>
            
        </Switch>
    </Router>
);

export default router;