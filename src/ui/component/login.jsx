import React from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.client = this.props.client;
    }

    login(event) {
        this.setState({login: true});
        event.preventDefault();

        this.client.login(this.refs.username.value, this.refs.password.value).then(() => {
            this.setState({error: undefined, message: "Connexion..."});
        }).catch((error) => {
            this.setState({login: false, error, message: undefined});
        });

        this.client.realmManager.once("ServersListMessage", () => {
            this.setState({message: "Connecté"});
            console.log(this.client.realmManager.servers);
            this.forceUpdate();
        });
    }

    selectingServer(id) {
        console.log(id);
    }

    selectingCharacter(id) {
        console.log(id);
    }

    render() {
        return (
            <div className="login">
                <h3>Connexion</h3>

                {this.client.currentState === this.client.states.DISCONNECTED && (
                    <form onSubmit={this.login.bind(this)}>
                        {this.state.message && <p>Info: {this.state.message}</p>}
                        {this.state.error && <p>Erreur: {this.state.error.message}</p>}
                        <input type="text" ref="username" placeholder="Nom de compte"/>
                        <input type="password" ref="password" placeholder="Mot de passe"/>
                        <input type="submit" disabled={this.state.login}/>
                    </form>
                )}

                {this.client.currentState === this.client.states.SELECTING_SERVER && (
                    <table>
                        <tbody>
                            {this.client.realmManager.servers
                                .filter((server) => server.isSelectable && server.charactersCount)
                                .map((server) =>
                                    <tr onClick={this.selectingServer.bind(this, server.id)}>
                                        <th>#{server.id}</th>
                                        <td>{server.name}</td>
                                        <td>{server.charactersCount}</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default Login;
