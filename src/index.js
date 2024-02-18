import React from "react";
import ReactDOM from "react-dom/client";
import bridge from "@vkontakte/vk-bridge";
import {App} from "./App";

bridge.send("VKWebAppInit").then();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
// if (process.env.NODE_ENV === "development") {
//   import("./eruda").then(({ default: _ }) => {}); //runtime download
// }
