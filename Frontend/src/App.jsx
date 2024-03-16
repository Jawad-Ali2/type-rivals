import "./App.css";
<<<<<<< Updated upstream
import { Header, ThemeSwitch } from "../components";
import { ThemeContext } from "../context/ThemeContext";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
=======

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ThemeSwitch from "@/components/ThemeSwitch";

import { ThemeContext } from "../context/ThemeContext";
import { useContext} from "react";

>>>>>>> Stashed changes
function App() {
  const { theme } = useContext(ThemeContext);

  const dynamicClass = `${theme} bg-skin-body w-full h-screen pb-[5rem]`;
  return (
    <div className={dynamicClass}>
      <Header />
      <ThemeSwitch />
      <section className="hero-section">
        <div className="hero-container  min-w-full w-full flex flex-column justify-center pt-[5rem] md:pt-[5rem]">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default App;
