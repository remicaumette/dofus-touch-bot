import * as React from "react";
import * as ReactDOM from "react-dom";
import {Game} from "@core/Game";
import {Logger} from "@util/Logger";

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
    };

    constructor(props: ApplicationProps) {
        super(props);

        this.props.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");
        this.props.logger.info("Dofus Touch Bot");
        this.props.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");
    }

    login(event: any) {
        this.props.logger.info("Attempt to login");
        event.preventDefault();

        const account: ApplicationAccount = {
            login: this.refs.login.value,
            password: this.refs.password.value
        };

        this.props.game.auth(account.login, account.password)
            .then(() => {
                this.props.logger.info("Logged");

                localStorage.setItem("lastAccount", JSON.stringify(account));

                this.props.logger.info("Switching to the realm server");
                return this.props.game.getRealmConnection().connect();
            })
            .then(() => {
                this.props.logger.info("Connected to the realm server");
            })
            .catch((error) => {
                this.props.logger.error("An error occurred while login", error);
            });
    }

    render() {
        return (
            <div>
                <h1>Dofus Touch Bot</h1>

                <form onSubmit={this.login.bind(this)}>
                    <input type="text" ref="login" placeholder="Nom de compte"
                           defaultValue={Application.getLastAccount().login}/>
                    <input type="password" ref="password" placeholder="Mot de passe"
                           defaultValue={Application.getLastAccount().password}/>

                    <input type="submit" value="Connexion"/>
                </form>
            </div>
        );
    }

    private static getLastAccount(): ApplicationAccount {
        return JSON.parse(localStorage.getItem("lastAccount")) || {};
    }
}

ReactDOM.render(<Application game={new Game()} logger={new Logger("Application")}/>,
    document.getElementById("root"));
