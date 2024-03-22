import website_logo from "/src/assets/website_logo.png";
import display_pic from "/src/assets/Default_dp.png";
import CIcon from "@coreui/icons-react";
import "@/styles/Header.css";
import { cilMenu } from "@coreui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { backendUrl } from "../../config/config";

const Header = () => {
  const [username, setUsername] = useState("John Doe");
  const [profilePic, setProfilePic] = useState(display_pic);
  const [offset, setOffset] = useState(0);
  const dropDownRef = useRef();
  const { isAuthenticated, token, csrfToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const headerBtns = [
    ["Home", "/home"],
    ["Collections", "/collections"],
    ["Dashboard", "/dashboard"],
  ];
  const subHeaderButtons = [
    ["Quick Race", "/race"],
    ["Race vs Narrator", "/narrator"],
    ["vs CPU", "/race"],
    ["Death Match", "/race"],
    ["Tournaments", "/race"],
  ];
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getUserDashboard() {
      const response = await axios.get(`${backendUrl}/user/dashboard`, {
        headers: { Authorization: "Bearer " + token },
        signal,
      });

      if (response.status === 200) {
        const data = await response.data;
        console.log(data);
        setUsername(data.name);
        setProfilePic(data.profilePic);
      }
    }
    getUserDashboard();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated]);

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
    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-csrf-token": csrfToken,
      },
    });
    if (response.ok) {
      logout();
      navigate("/");
    }
  }
  function handleMouseOver() {
    const profileDropDown = document.querySelector(".profile-dropdown");
    const nameContainer = document.querySelector(".name-container");
    profileDropDown.classList.add("h-[10rem]");
    profileDropDown.classList.remove("h-[0rem]");
    nameContainer.classList.remove("opacity-0", "right-[2rem]");
    nameContainer.classList.add("opacity-100", "right-[5rem]");
  }

  function handleMouseLeave() {
    const profileDropDown = document.querySelector(".profile-dropdown");
    const nameContainer = document.querySelector(".name-container");
    profileDropDown.classList.add("h-[0rem]");
    profileDropDown.classList.remove("h-[10rem]");
    nameContainer.classList.add("opacity-0", "right-[2rem]");
    nameContainer.classList.remove("opacity-100", "right-[5rem]");
  }

  return (
    <section className="header-section faded-border border-b-2">
      <div className="header-container fixed w-full h-[5rem] bg-skin-overlayBG z-[500] ">
        <div className="header-contents h-full w-[95%] m-auto flex flex-row justify-between items-center">
          <div className="logo-container h-full">
            <img
              className="h-full inline-block"
              src={website_logo}
              alt="type rivals"
              id="web-logo"
            />
            <p className="inline-block text-skin-base">Type Rivals</p>
          </div>
          <div className="dropddown-button h-[25px] md:hidden">
            <CIcon
              size="xl"
              className="h-[25px] text-skin-base cursor-pointer"
              onClick={handleDropDown}
              icon={cilMenu}
            />
          </div>
          <div className="header-nav flex-row  justify-between items-center w-[23rem] hidden md:flex">
            <ul className="nav-list  text-md  hidden md:inline-block ">
              {headerBtns.map(([el, link], i) => (
                <NavLink key={i} to={link} end>
                  <li className="w-fit text-skin-base cursor-pointer inline h-[2rem] transition-all duration-200 py-2 m-2">
                    {el}
                  </li>
                </NavLink>
              ))}
            </ul>
          </div>
          {isAuthenticated ? (
            <div
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
              className="profile-navigation hidden md:block relative min-w-[8rem]  h-[3rem]"
            >
              <div className="profile-pic-container w-[3rem] h-[3rem]  rounded-[200%] absolute top-0 right-[1rem] z-50">
                <img
                  src={profilePic}
                  className="w-full h-full p-[3px] rounded-[200%]"
                />
              </div>
              <div className="name-container transition-all duration-300 max-w-[10rem] absolute truncate text-nowrap text-skin-base bg-skin-bar z-10 top-[0.6rem] right-[2rem] opacity-0 p-1 text-sm rounded-lg">
                {username}
              </div>
              <div className="profile-dropdown absolute transition-all duration-300 right-[-1.5rem] top-[4rem] w-[8rem] overflow-hidden h-[0rem] rounded-lg bg-skin-overlayBG shadow-md shadow-skin-base z-[500]">
                <ul className="profile-btns-list  px-2">
                  <li className="text-skin-base cursor-pointer hover:bg-skin-bar rounded-sm">
                    Leaderboard
                  </li>
                  <li className="text-skin-base cursor-pointer hover:bg-skin-bar rounded-sm">
                    <Link to={"/dashboard"}>Dashboard</Link>
                  </li>
                  <li className="text-skin-base cursor-pointer hover:bg-skin-bar rounded-sm">
                    Settings
                  </li>
                  <li
                    className="text-red-600 hover:text-red-700 !border-none cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link className="hidden md:block" to={"/auth"}>
              <button className="bg-skin-button shadow-md shadow-skin-base text-skin-base rounded-xl hover:scale-105 transition-all duration-300 p-2">
                Sign In
              </button>
            </Link>
          )}
        </div>
        <div className="sub-header w-full hidden md:block h-[2rem] ">
          <ul className="subheader-nav shadow-sm shadow-skin-base bg-skin-bar  w-full flex flex-row justify-center items-center mx-auto text-sm ">
            {subHeaderButtons.map(([el, link], i) => (
              <Link className="my-2" to={link} key={i}>
                <li className="w-fit inline cursor-pointer transition-all duration-200 md:mx-2 lg:mx-4 xl:mx-6 text-skin-base">
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
        <ul className="nav-list text-skin-base text-md">
          {headerBtns.map(([el, link], i) => (
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
          {subHeaderButtons.map(([el, link], i) => (
            <Link key={i} to={link}>
              <li className="w-fit h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                {el}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default Header;
