import Race from "@/pages/Race";
import { ModalContext } from "../../context/ModalContext";
import twoFriends from "/2-friends.svg";
import threeFriends from "/3-friends.svg";
import fourFriends from "/4-friends.svg";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { RaceContext } from "../../context/RaceContext";

export const Modal = () => {
  const modalRoot = document.getElementById("modal-root");
  const { isOpen, setIsOpen } = useContext(ModalContext);
  const { lobbySizeRef, updateLobbySize } = useContext(RaceContext);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = (lobbySize) => {
    updateLobbySize(lobbySize);
    console.log(lobbySizeRef);
    navigate("/play-with-friends");
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="text-black fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center z-1">
      <div className="bg-web bg-white w-[70%] p-2 rounded-xl">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-semibold p-2">Challenge your friends</h1>
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
            <p className="text-center">Challenge your friend</p>
          </div>
          <div
            onClick={() => {
              handleClick(3);
              setIsOpen(false);
            }}
          >
            <img className="w-[90%] m-auto" src={threeFriends} alt="" />
            <p className="text-center">Challenge your friend</p>
          </div>
          <div
            onClick={() => {
              handleClick(4);
              setIsOpen(false);
            }}
          >
            <img className="w-[90%] m-auto" src={fourFriends} alt="" />
            <p className="text-center">Challenge your friend</p>
          </div>
        </div>
      </div>
      <button onClick={handleClose}>Close</button>
    </div>,
    modalRoot
  );
};
