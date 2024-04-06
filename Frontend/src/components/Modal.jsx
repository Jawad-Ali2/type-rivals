import { ModalContext } from "../../context/ModalContext";
import twoFriends from "/2-friends.svg";
import threeFriends from "/3-friends.svg";
import fourFriends from "/4-friends.svg";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { RaceContext } from "../../context/RaceContext";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

export const Modal = () => {
  const modalRoot = document.getElementById("modal-root");
  const { isOpen, setIsOpen } = useContext(ModalContext);
  const { lobbySizeRef, updateLobbySize } = useContext(RaceContext);
  const inputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef(null))
  );
  const submitButtonRef = useRef(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [hasRouteChanged, setHasRouteChanged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (hasRouteChanged) {
      handleClose();
    } else {
      setHasRouteChanged(true);
    }
  }, [location.pathname]);

  const handleClose = () => {
    console.log("KDSHGHJ");
    setIsOpen(false);
    setShowCreate(false);
    setShowJoin(false);
    inputRefs.current.forEach((inputRef) => {
      if (inputRef.current) {
        inputRef.current.value = ""; // Reset the value if the ref is valid
      }
    });
  };

  const handleCreateClick = () => {
    setShowCreate((prev) => !prev);
  };
  const handleJoinClick = () => {
    setShowJoin((prev) => !prev);
  };

  console.log(showCreate, showJoin);

  const handleClick = (lobbySize) => {
    updateLobbySize(lobbySize);
    console.log(lobbySizeRef);
    navigate("/play-with-friends");
  };

  const handleInputChange = (index, e) => {
    let newValue = e.target.value.toUpperCase();
    e.target.value = newValue;
    if (newValue.length === 1 && index < 5) {
      inputRefs.current[index + 1].current.focus();
    } else {
      submitButtonRef.current.focus();
    }
  };

  const handleInputClick = (index) => {
    inputRefs.current[index].current.select();
  };

  const handleInputFocus = (index) => {
    inputRefs.current[index].current.value = "";
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // Check if the clicked element is the overlay
      handleClose(); // Close the modal only if the overlay is clicked
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="text-black fixed top-0 left-0 w-full h-full bg-black bg-opacity-50  flex justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-web bg-white p-2 rounded-xl ">
        {!showCreate && !showJoin && (
          <div className="text-center">
            <button className="web-button" onClick={handleCreateClick}>
              Create
            </button>
            <button className="web-button" onClick={handleJoinClick}>
              Join
            </button>
          </div>
        )}
        {showCreate && (
          <>
            <div className="text-center mb-5 mx-10">
              <h1 className="text-2xl font-semibold p-2">
                Challenge your friends
              </h1>
              <p>Compete while enjoying with your friends!</p>
            </div>
            <hr />
            <div className="flex justify-around mt-5 p-5">
              <div
                onClick={() => {
                  handleClick(2);
                  setIsOpen(false);
                }}
              >
                <img className="w-[90%] m-auto" src={twoFriends} alt="" />
                <p className="text-center">2 Players</p>
              </div>
              <div
                onClick={() => {
                  handleClick(3);
                  setIsOpen(false);
                }}
              >
                <img className="w-[90%] m-auto" src={threeFriends} alt="" />
                <p className="text-center">3 Players</p>
              </div>
              <div
                onClick={() => {
                  handleClick(4);
                  setIsOpen(false);
                }}
              >
                <img className="w-[90%] m-auto" src={fourFriends} alt="" />
                <p className="text-center">4 Players</p>
              </div>
            </div>
          </>
        )}

        {showJoin && (
          <>
            <div className="text-center mb-5 mx-10">
              <h1 className="text-2xl font-semibold p-2">
                Challenge your friends
              </h1>
              <p>Compete while enjoying with your friends!</p>
            </div>
            <hr />
            <div className="m-10 flex justify-evenly items-center">
              {inputRefs.current.map((inputRef, index) => (
                <React.Fragment key={index}>
                  <input
                    className="p-3 w-[3rem] rounded-md border text-sm ring-offset-background  border-skin-base text-center m-auto"
                    ref={inputRef}
                    maxLength={1}
                    onChange={(e) => handleInputChange(index, e)}
                    onClick={() => handleInputClick(index)}
                    onFocus={() => handleInputFocus(index)}
                  />
                  {(index + 1) % 3 === 0 && index !== 5 && <div>-</div>}
                </React.Fragment>
              ))}
            </div>
            <div className="text-center">
              <button
                className="web-button"
                ref={submitButtonRef}
                onClick={() => console.log("Form submitted")}
              >
                Submit
              </button>
            </div>
            <div className="flex justify-around mt-5 p-5"></div>
          </>
        )}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>,
    modalRoot
  );
};
