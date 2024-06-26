import "./App.css";
import Header from "@/components/Header";
import ThemeSwitch from "@/components/ThemeSwitch";
import { ThemeContext } from "../context/ThemeContext";
import Hero from "@/components/Hero";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ModalProvider } from "../context/ModalContext";
import { ToastContainer } from "react-toastify";

function App() {
  const { theme } = useContext(ThemeContext);

  const dynamicClass = `${theme} bg-primary-a text-secondary-d w-full min-h-screen pb-[5rem]`;
  return (
    <div className={dynamicClass}>
      <ModalProvider>
        <Header />
        <ThemeSwitch />
        <section className="hero-section">
          <div className="hero-container  min-w-full w-full flex flex-column justify-center pt-[5rem] md:pt-[5rem]">
            <ToastContainer />
            {/* <Hero /> */}
            <Outlet />
            {/* <ToastContainer /> */}
          </div>
        </section>
      </ModalProvider>
    </div>
  );
}

export default App;
