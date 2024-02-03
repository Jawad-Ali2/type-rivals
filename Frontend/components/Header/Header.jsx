import website_logo from "/src/assets/website_logo.png";
import display_pic from "/src/assets/Default_dp.png";
import CIcon from "@coreui/icons-react";
import "./Header.css"
import { cilMenu } from "@coreui/icons";
import { useContext, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Header = () => {
  const dropDownRef = useRef();
  const { isAuthenticated, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDropDown = () => {
    if (dropDownRef.current.classList.contains("left-0")) {
      dropDownRef.current.classList.remove("left-0");
      dropDownRef.current.classList.add("left-[-20rem]");
    } else {
      dropDownRef.current.classList.remove("left-[-20rem]");
      dropDownRef.current.classList.add("left-0");
    }
  };
  
  async function handleLogout() {
    const response = await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      logout();
      navigate("/");
    }
  }

  return (
    <section className="header-section">
      <div className="header-container fixed w-full h-[5rem] web-gradient">
        <div className="header-contents h-full w-[95%] m-auto flex flex-row justify-between items-center">
          <div className="logo-container h-full">
            <img
              className="h-full inline-block"
              src={website_logo}
              alt="type rivals"
              id="web-logo"
            />
            <p className="inline-block web-text">Type Rivals</p>
          </div>
          <div className="dropddown-button h-[25px] md:hidden">
            <CIcon
              size="xl"
              className="h-[25px] web-text cursor-pointer"
              onClick={handleDropDown}
              icon={cilMenu}
            />
          </div>
          <div className="header-nav  flex-row justify-between items-center pr-5 hidden md:flex" >
            <ul className="nav-list  text-md  hidden md:inline-block">
              {[
                ["Home", "/home"],
                ["Collections", "/collections"],
                ["Dashboard", "/dashboard"],
                // isAuthenticated ? ["Log out", "/logout"] : ["Login", "/auth"],
              ].map(([el, link], i) => (
                <NavLink key={i} to={link} end>
                  <li className="w-fit web-text  cursor-pointer inline h-[2rem] transition-all duration-200 py-2 m-2">
                    {el}
                  </li>
                </NavLink>
              ))}
            </ul>
            <div className="profile-nav cursor-pointer relative hidden md:block ml-[0rem] duration-300 transition-all" onMouseOver={()=>{
              const el = document.querySelector(".profile-nav")
              const list = document.querySelector(".profile-nav-list")
              const anchor = document.querySelector(".anchor")
              const nameContainer = document.querySelector(".name-container")
              el.classList.remove("ml-[0rem]")
              el.classList.add("ml-[10rem]")
              nameContainer.classList.remove("w-[0rem]", "opacity-0")
              nameContainer.classList.add("w-[10rem]", "opacity-100")
              anchor.classList.remove("hidden")
              list.classList.remove("h-[0rem]")
              list.classList.add("h-[10rem]")
            }} onMouseLeave={()=>{
              const el = document.querySelector(".profile-nav")
          
              const list = document.querySelector(".profile-nav-list")
              const anchor = document.querySelector(".anchor")
              const nameContainer = document.querySelector(".name-container")
              el.classList.add("ml-[0rem]")
              el.classList.remove("ml-[10rem]")
              nameContainer.classList.add("w-[0rem]", "opacity-0")
              nameContainer.classList.remove("w-[10rem]", "opacity-100")
              anchor.classList.add("hidden")
              list.classList.add("h-[0rem]")
              list.classList.remove("h-[10rem]")
            }}>
              <div className="name-container absolute w-[10rem] opacity-0 transition-all duration-300 h-[1.5rem] text-md z-10 truncate text-nowrap right-[3.3rem] top-[1rem] web-background px-2">
                <p className="text-white">Mikasa Ackerman</p>
              </div>
              <div className="img-container p-1 web-background z-20 rounded-[200%]">
                  <img src={display_pic} className="h-[3rem] w-[3rem]"/>
              </div>
              <div className="anchor top-[3.5rem] hidden"></div>
              <div className="profile-nav-list web-foreground w-[9rem] overflow-hidden absolute h-[0rem] top-[4rem] transition-all duration-300 left-[-3rem]">
                <ul className="profile-btns-list w-full text-left p-2">
                  <li className="web-text cursor-pointer">Dashboard</li>
                  <li className="web-text cursor-pointer">Collections</li>
                  <li className="web-text cursor-pointer">Settings</li>
                  <li className="web-text cursor-pointer !border-none">Logout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-header w-full hidden md:block h-[2rem] web-background">
          <ul className="subheader-nav  w-full flex flex-row justify-center items-center mx-auto text-sm ">
            {[
              "Quick Race",
              "1-v-1",
              "vs CPU",
              "Death Match",
              "Tournaments",
            ].map((el, i) => (
              <Link className="my-2" to={"/race"} key={i}>
                <li className="w-fit inline cursor-pointer transition-all duration-200 md:mx-2 lg:mx-4 xl:mx-6 web-text">
                  {el}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      <div
        ref={dropDownRef}
        className="dropdown-menu z-40 md:hidden transition-all duration-300 fixed w-[10rem] h-screen web-gradient top-[5rem] left-[-20rem]"
      >
        <ul className="nav-list web-text text-md">
          {[
            ["Home", "/home"],
            ["Collections", "/collections"],
            ["Dashboard", "/dashboard"],
          ].map(([el, link], i) => (
            <NavLink key={i} to={link} end>
              <li className="w-fit h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                {el}
              </li>
            </NavLink>
          ))}
          <button
            className="w-fit h-[2rem] transition-all duration-200  mx-2 border-b-[#3B6187]"
            onClick={handleLogout}
          >
            {isAuthenticated ? "Log out" : "Sign In"}
          </button>
          <li className="faded-border w-full border-b-[2px]"></li>
          {["Quick Race", "1-v-1", "vs CPU", "Death Match", "Tournaments"].map(
            (el, i) => (
              <Link key={i} to={"/race"}>
                <li className="w-fit h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                  {el}
                </li>
              </Link>
            )
          )}
        </ul>
      </div>
    </section>
  );
};
