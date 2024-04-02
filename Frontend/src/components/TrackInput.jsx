import { RaceContext } from "../../context/RaceContext";
import { useState, useEffect, useContext } from "react";
const TrackInput = ({
  paragraph,
  input,
  setInput,
  setCorrect,
  raceFinished,
  setRaceFinished,
}) => {
  const { iHaveFinished, changeIHaveFinished } = useContext(RaceContext);

  const handleInputChange = (e) => {
    const typedInput = e.target.value;
    const progressedParagraph = paragraph.slice(0, typedInput.length);
    setInput((prev) => typedInput);
    if (typedInput === progressedParagraph) {
      setCorrect((prev) => true);
      if (typedInput === paragraph) {
        console.log("INPUT IS SAME");
        // TODO: If one player has completed the paragraph he waits for other players to complete
        // setRaceFinished((prev) => true);
        changeIHaveFinished(true);
      }
    } else {
      setCorrect((prev) => false);
    }
  };
  return (
    <input
      disabled={iHaveFinished}
      value={input}
      onChange={handleInputChange}
      placeholder="Type Here..."
      className="track-input pr-6 web-body border-b-2 border-skin-base outline-none web-text w-full"
    />
  );
};
export default TrackInput;
