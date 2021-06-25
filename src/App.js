import { useEffect } from "react";
import Routes from "./routes";
const App = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    const body = document.body;
    root.classList.add("border-box");
    root.classList.add("p-0");
    root.classList.add("m-0");
    root.classList.add("font-cool");
    root.classList.add("font-medium");
    root.classList.add("text-sm");
    body.classList.add("overflow-x-hidden");
  }, []);
  return <Routes />;
};

export default App;
