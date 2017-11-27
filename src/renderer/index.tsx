import * as React from "react";
import * as ReactDOM from "react-dom";
import {Game} from "@core/Game";
import {Logger} from "@util/Logger";

import "./index.css";

interface ApplicationProps {
}

interface ApplicationState {
}

class Application extends React.Component<ApplicationProps, ApplicationState> {
    private logger: Logger;
    private game: Game;
    private loginRef: HTMLInputElement;
    private passwordRef: HTMLInputElement;

    constructor(props: any) {
        super(props);

        this.logger = new Logger("Application");
        this.game = new Game();

        this.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");
        this.logger.info("Dofus Touch Bot");
        this.logger.info("✲ﾟ｡.(✿╹◡╹)ﾉ☆.｡₀:*ﾟ✲ﾟ");
    }

    login(event: any) {
        this.logger.info("Attempt to login");
        event.preventDefault();

        this.game.auth(this.loginRef.value, this.passwordRef.value)
            .then(() => {
                this.logger.info("Logged");
                this.logger.info("Switching to the realm server");
                return this.game.getRealmConnection().connect();
            })
            .then(() => {
                this.logger.info("Connected to the realm server");
            })
            .catch((error) => {
                this.logger.error("An error occurred while login", error);
            });
    }

    render(): any {
        return (
            <div>
                <h1>Dofus Touch Bot</h1>

                <form onSubmit={this.login.bind(this)}>
                    <input type="text" ref={(ref) => this.loginRef = ref} placeholder="Nom de compte"/>
                    <input type="password" ref={(ref) => this.passwordRef = ref} placeholder="Mot de passe"/>
                    <input type="submit" value="Connexion"/>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById("root"));
