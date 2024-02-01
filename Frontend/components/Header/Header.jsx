import website_logo from "/src/assets/website_logo.png";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
import { useContext, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const Header = () => {
  const dropDownRef = useRef();
  const { isAuthenticated } = useContext(AuthContext);
  const handleDropDown = () => {
    if (dropDownRef.current.classList.contains("left-0")) {
      dropDownRef.current.classList.remove("left-0");
      dropDownRef.current.classList.add("left-[-20rem]");
    } else {
      dropDownRef.current.classList.remove("left-[-20rem]");
      dropDownRef.current.classList.add("left-0");
    }
  };
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
          <ul className="nav-list web-text text-md  hidden md:inline-block">
            {[
              ["Home", "/home"],
              ["Collections", "/collections"],
              ["Dashboard", "/dashboard"],
              isAuthenticated ? ["Login", "/auth"] : ["Log out", "/logout"],
            ].map(([el, link], i) => (
              <NavLink key={i} to={link} end>
                <li className="w-fit  cursor-pointer inline h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                  {el}
                </li>
              </NavLink>
            ))}
          </ul>
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
            ["Log Out", "/logout"],
          ].map(([el, link], i) => (
            <NavLink key={i} to={link} end>
              <li className="w-fit h-[2rem] transition-all duration-200 py-2 m-2 border-b-[#3B6187] hover:border-b-[2px] border-b-[0px]">
                {el}
              </li>
            </NavLink>
          ))}
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
