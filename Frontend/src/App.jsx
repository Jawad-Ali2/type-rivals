import "./App.css";
import Header from "@/components/Header";
import ThemeSwitch from "@/components/ThemeSwitch";
import { ThemeContext } from "../context/ThemeContext";
import Hero from "@/components/Hero";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
function App() {
  const { theme } = useContext(ThemeContext);

  const dynamicClass = `${theme}  bg-skin-body w-full min-h-screen pb-[5rem]`;
  return (
    <div className={dynamicClass}>
      <Header />
      <ThemeSwitch />
      <section className="hero-section">
        <div className="hero-container  min-w-full w-full flex flex-column justify-center pt-[5rem] md:pt-[5rem]">
          <Hero/>
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default App;
