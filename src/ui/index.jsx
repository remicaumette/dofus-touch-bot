import * as React from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

window.navigator.__defineGetter__("userAgent", () =>
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1");

ReactDOM.render(<h1>Hellow</h1>, document.getElementById("root"));
