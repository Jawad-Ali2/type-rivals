import website_logo from "/src/assets/website_logo.png";
import CIcon from "@coreui/icons-react";
import "@/styles/Header.css";
import { cilMenu } from "@coreui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import axios from "axios";
import defaultImage from "/anonymous-user.jpg";
import { backendUrl } from "../../config/config";
import { Modal } from "./Modal";

const Header = () => {
  const [username, setUsername] = useState("John Doe");
  const [profilePic, setProfilePic] = useState(defaultImage);
  const dropDownRef = useRef();
  const { isAuthenticated, token, csrfToken, logout } = useContext(AuthContext);
  const { isOpen, setIsOpen } = useContext(ModalContext);
  const navigate = useNavigate();

  const headerBtns = [
    ["Home", "/home"],
    ["Collections", "/collections"],
    ["Dashboard", "/dashboard"],
  ];

  // If user not authenticate he see other dashboard
  const subHeaderButtons = isAuthenticated
    ? [
        ["Quick Race", "/race?lobbySize=2&multiplayer=true"],
        ["Race vs Narrator", "/narrator"],
        ["vs CPU", "/race"],
        ["vs Friends", "#"],
        ["Practice", "/practice?lobbySize=1&practiceMode=true"],
        ["Tournaments", "/race"],
      ]
    : [
        ["Quick Race", "/race?lobbySize=2"],
        ["Race vs Narrator", "/narrator"],
        ["vs CPU", "/race"],
        ["Practice", "/practice?lobbySize=1"],
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
        setUsername(data.name);

        if (!data.profilePic) {
          setProfilePic(defaultImage);
        } else {
          setProfilePic(data.profilePic);
        }
      }
    }

    if (isAuthenticated) getUserDashboard();

    return () => {
      controller.abort();
    };
  }, [isAuthenticated]);

  const handleLinkClick = (link) => {
    if (link === "#") setIsOpen(() => true);
  };

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
      <div className="header-container fixed w-full h-[5rem]  bg-primary-b z-[500] ">
        <div className="header-contents h-full w-[95%] m-auto flex flex-row justify-between items-center">
          <div className="logo-container h-full" onClick={() => navigate("/")}>
            <img
              className="h-full inline-block cursor-pointer"
              src={website_logo}
              alt="type rivals"
              id="web-logo"
            />
            <p className="inline-block  cursor-pointer">Type Rivals</p>
          </div>
          <div className="dropddown-button h-[25px] md:hidden">
            <CIcon
              size="xl"
              className="h-[25px]  cursor-pointer"
              onClick={handleDropDown}
              icon={cilMenu}
            />
          </div>
          <div className="header-nav flex-row  justify-between items-center w-[17rem] hidden md:flex">
            <ul className="nav-list  text-md  hidden md:inline-block relative right-10">
              {headerBtns.map(([el, link], i) => (
                <NavLink key={i} to={link} end>
                  <li className="w-fit  cursor-pointer inline h-[2rem] transition-all duration-200 py-2 m-2">
                    {el}
                    {el === "Collections" && (
                      <span className="bg-red-500 text-white text-[0.55rem] relative bottom-2 ms-1 font-medium px-2 py-0.1 rounded-full">
                        Soon
                      </span>
                    )}
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
                  src={profilePic ? profilePic : defaultImage}
                  className="w-full h-full p-[3px] rounded-[200%]"
                />
              </div>
              <div className="name-container transition-all duration-300 max-w-[10rem] absolute truncate text-nowrap  bg-primary-c z-10 top-[0.6rem] right-[2rem] opacity-0 px-2 py-1 text-sm rounded-lg">
                {username}
              </div>
              <div className="profile-dropdown absolute transition-all duration-300 right-[-1.5rem] top-[4rem] w-[8rem] overflow-hidden h-[0rem] rounded-lg bg-primary-e z-[500]">
                <ul className="profile-btns-list  px-2">
                  <li className=" cursor-pointer hover:bg-primary-b rounded-sm">
                    Leaderboard
                  </li>
                  <li className=" cursor-pointer hover:bg-primary-b rounded-sm">
                    <Link to={"/dashboard"}>Dashboard</Link>
                  </li>
                  <li className=" cursor-pointer hover:bg-primary-b rounded-sm">
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
              <button className="bg-primary-e ui-button text-sm">
                Sign In
              </button>
            </Link>
          )}
        </div>
        <div className="sub-header w-full hidden md:block h-[2rem] ">
          <ul className="subheader-nav  bg-primary-c  w-full flex flex-row justify-center items-center mx-auto text-sm ">
            {subHeaderButtons.map(([el, link], i) => (
              <Link
                className="my-2"
                to={link}
                key={i}
                onClick={() => handleLinkClick(link)}
              >
                <li className="w-fit inline cursor-pointer transition-all duration-200 md:mx-2 lg:mx-4 xl:mx-6 ">
                  {el}
                  {(el === "vs CPU" || el === "Tournaments") && (
                    <span className="bg-red-500 text-white text-[0.55rem] relative bottom-1 ms-1 font-medium px-2 py-0.1 rounded-full">
                      Soon
                    </span>
                  )}
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
        <ul className="nav-list  text-md">
          {headerBtns.map(([el, link], i) => (
            <NavLink key={i} to={link} end>
              <li className="w-fit h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                {el}
                {el === "Collections" && (
                  <span className="bg-red-500 text-white text-[0.55rem] relative bottom-1 ms-1 font-medium px-2 py-0.1 rounded-full">
                    Soon
                  </span>
                )}
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
      <Modal isOpen={isOpen} />
    </section>
  );
};
export default Header;
