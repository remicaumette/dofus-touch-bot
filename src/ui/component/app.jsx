import React from "react";
import {Client} from "../../dofus";
import Home from "./home";
import Login from "./login";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.client = new Client();
    }

    render() {
        return (
            <div>
                {this.client.currentState === this.client.states.ONLINE ?
                    <Home client={this.client}/>
                    :
                    <Login client={this.client}/>}
            </div>
        );
    }
}

export default App;
