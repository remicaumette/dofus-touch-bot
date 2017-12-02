import * as React from "react";
import * as ReactDOM from "react-dom";
import {Game} from "@core/Game";
import {Logger} from "@util/Logger";
import {GameState} from "@core/GameState";
import {ServerStatus} from "@protocol/enum/ServerStatus";

import "./index.css";

interface ApplicationProps {
    logger: Logger;
    game: Game;
}

interface ApplicationAccount {
    login: string;
    password: string;
}

class Application extends React.Component<ApplicationProps, {}> {
    refs: {
        login: HTMLInputElement;
        password: HTMLInputElement;
        server: HTMLInputElement;
        character: HTMLInputElement;
    };

    constructor(props: ApplicationProps) {
        super(props);

        this.props.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");
        this.props.logger.info("Dofus Touch Bot");
        this.props.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");

        this.props.game.on("stateUpdated", (event) => {
            this.forceUpdate();
            if (this.props.game.getState() == GameState.SWITCHING) {
                this.props.game.getGameConnection().connect()
                    .catch((error) => {
                        this.props.logger.error("An error occurred while connecting to game", error);
                    });
            }
        });
    }

    auth(event: any) {
        this.props.logger.info("Attempt to login");
        event.preventDefault();

        const account: ApplicationAccount = {
            login: this.refs.login.value,
            password: this.refs.password.value
        };

        this.props.game.auth(account.login, account.password)
            .catch((error) => {
                this.props.logger.error("An error occurred while login", error);
            });
    }

    connectToRealm() {
        this.props.logger.info("Attempt to connect to the realm");
        event.preventDefault();

        this.props.game.getRealmConnection().connect()
            .catch((error) => {
                this.props.logger.error("An error occurred while connecting to realm", error);
            });
    }

    selectServer(event: any) {
        event.preventDefault();

        const server = this.props.game.getRealmConnection().getServers()
            .filter(server => server.getId() === Number(this.refs.server.value)).pop();
        this.props.game.getRealmConnection().selectServer(server);
    }

    selectCharacter(event: any) {
        event.preventDefault();

        const character = this.props.game.getGameConnection().getCharacters()
            .filter(character => character.getId() === Number(this.refs.character.value)).pop();
        this.props.game.getGameConnection().selectCharacter(character);
    }

    renderForGameState() {
        switch (this.props.game.getState()) {
            case GameState.OFFLINE:
                return (
                    <form onSubmit={this.auth.bind(this)}>
                        <input type="text" ref="login" placeholder="Nom de compte"
                               defaultValue={Application.getLastAccount().login}/>
                        <input type="password" ref="password" placeholder="Mot de passe"
                               defaultValue={Application.getLastAccount().password}/>

                        <input type="submit" value="Connexion"/>
                    </form>
                );
            case GameState.AUTHENTICATED:
                return (
                    <button onClick={this.connectToRealm.bind(this)}>
                        Se connecter au serveur
                    </button>
                );
            case GameState.CONNECTING:
                return (
                    <p>
                        Connexion...
                    </p>
                );
            case GameState.IN_QUEUE:
                return (
                    <p>
                        Vous êtes dans la file d'attente...
                    </p>
                );
            case GameState.SELECTING_SERVER:
                return (
                    <form onSubmit={this.selectServer.bind(this)}>
                        <select ref="server">
                            {this.props.game.getRealmConnection().getServers()
                                .filter((server) => server.getStatus() === ServerStatus.ONLINE && server.isSelectable())
                                .map((server) => (
                                    <option value={server.getId()} key={server.getId()}>
                                        {server.getName()}
                                    </option>
                                ))}
                        </select>
                        <input type="submit" value="Valider"/>
                    </form>
                );
            case GameState.CONNECTING_TO_GAME:
                return (
                    <p>
                        Connexion au serveur de jeu...
                    </p>
                );
            case GameState.SELECTING_CHARACTER:
                return (
                    <form onSubmit={this.selectCharacter.bind(this)}>
                        <select ref="character">
                            {this.props.game.getGameConnection().getCharacters()
                                .map((character) => (
                                    <option value={character.getId()} key={character.getId()}>
                                        {character.getName()} (Niveau : {character.getLevel()})
                                    </option>
                                ))}
                        </select>
                        <input type="submit" value="Valider"/>
                    </form>
                );
            case GameState.ONLINE:
                return (
                    <p>
                        Connecté !
                    </p>
                );
        }
    }

    render() {
        return (
            <div>
                <h1>Dofus Touch Bot</h1>
                {this.renderForGameState()}
            </div>
        );
    }

    private static getLastAccount(): ApplicationAccount {
        return JSON.parse(localStorage.getItem("lastAccount")) || {};
    }
}

declare global {
    interface Window {
        game: any;
    }
}

ReactDOM.render(<Application game={window.game = new Game()} logger={new Logger("Application")}/>,
    document.getElementById("root"));
