import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [name, setName] = useState("React");

  useEffect(() => {
    axios
      .get("/api/home/")
      .then((response) => {
        setName(response.data.name);
        console.log("Data fetched successfully:", response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold ">Hello world!</h1>
      <h4 className="text-lg">{name}</h4>
    </>
  );
}

export default App;
