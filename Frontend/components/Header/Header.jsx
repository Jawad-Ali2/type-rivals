import website_logo from "/src/assets/website_logo.png";
import display_pic from "/src/assets/Default_dp.png";
import CIcon from "@coreui/icons-react";
import "./Header.css";
import { cilMenu } from "@coreui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Header = () => {
  const [username, setUsername] = useState("John Doe");
  const [offset, setOffset] = useState(0)
  const dropDownRef = useRef();
  const { isAuthenticated, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserDashboard() {
      const response = await fetch("http://localhost:8000/user/dashboard", {
        headers: { Authorization: "Bearer " + token },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.name);
      }
    }
    getUserDashboard();
  }, []);

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
  function handleMouseOver() {
    const el = document.querySelector(".profile-nav");
    const list = document.querySelector(".profile-nav-list");
    const anchor = document.querySelector(".anchor");
    const nameContainer = document.querySelector(".name-container");
    setOffset(username.length);
    nameContainer.classList.remove("opacity-0");
    nameContainer.classList.add("opacity-100");
    anchor.classList.remove("opacity-0");
    anchor.classList.add("opacity-100");
    list.classList.remove("h-[0rem]");
    list.classList.add("h-[10rem]");
  }

  function handleMouseLeave() {
    const el = document.querySelector(".profile-nav");

    const list = document.querySelector(".profile-nav-list");
    const anchor = document.querySelector(".anchor");
    const nameContainer = document.querySelector(".name-container");
    setOffset(0);
    nameContainer.classList.add("w-[0rem]", "opacity-0");
    nameContainer.classList.remove("w-[10rem]", "opacity-100");
    anchor.classList.add("opacity-0");
    anchor.classList.remove("opacity-100");
    list.classList.add("h-[0rem]");
    list.classList.remove("h-[10rem]");
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
          <div className="header-nav flex-row w-auto justify-between items-center pr-5 hidden md:flex">
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

          </div>
          {isAuthenticated?<div className="profile-navigation relative max-w-[13rem] w-full h-[4rem]">
                <div className="profile-pic-container w-[4rem] h-[4rem] web-background rounded-[200%] absolute top-0 right-[1rem]">
                  <img src={display_pic} className="w-full h-full p-2"/>
                </div>
               <div className="name-container max-w-[10rem] absolute truncate text-nowrap web-background text-white top-[1rem] right-[6rem] p-1 text-sm rounded-lg">
                  {username} 
               </div>
               <div className="profile-dropdown absolute right-[-1rem] top-[5rem] w-[8rem] h-[10rem] rounded-lg web-gradient shadow-md shadow-[#031221]">
                  <ul className="profile-btns-list  px-2">
                    <li className="web-text cursor-pointer">Leaderboard</li>
                    <li className="web-text cursor-pointer">Dashboard</li>
                    <li className="web-text cursor-pointer">Settings</li>
                    <li className="text-red-600 hover:text-red-700 !border-none cursor-pointer" onClick={handleLogout}>Logout</li>
                  </ul>
               </div>
            </div>:
            <Link to={"/auth"}><button className="web-background web-text rounded-xl hover:scale-105 transition-all duration-300 p-2">Sign In</button></Link>
            }
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
