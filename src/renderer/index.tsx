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
    private saveRef: HTMLInputElement;

    constructor(props: any) {
        super(props);

        this.logger = new Logger("Application");
        this.game = new Game();
    }

    login(event: any) {
        this.logger.info("Attempt to login");
        event.preventDefault();

        this.game.setupGame(this.loginRef.value, this.passwordRef.value)
            .then(() => {
                this.logger.info("Login ok!");
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
                    <input type="checkbox" ref={(ref) => this.saveRef = ref}/>
                    <input type="submit" value="Connexion"/>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<Application/>, document.getElementById("root"));
