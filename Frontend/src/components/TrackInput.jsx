import { RaceContext } from "../../context/RaceContext";
import { useEffect, useState, useContext } from "react";
import { IoWarning } from "react-icons/io5";
const TrackInput = ({
  paragraph,
  input,
  setInput,
  setCorrect,
  raceFinished,
  setRaceFinished,
}) => {
  const { iHaveFinished, changeIHaveFinished } = useContext(RaceContext);
  const [pasted, setPasted] = useState(false);
  const handleInputChange = (e) => {
    const typedInput = e.target.value;
    const progressedParagraph = paragraph.slice(0, typedInput.length);
    setInput((prev) => typedInput);
    if (typedInput === progressedParagraph) {
      setCorrect((prev) => true);
      if (typedInput === paragraph) {
        changeIHaveFinished(true);
      }
    } else {
      setCorrect((prev) => false);
    }
  };
  const fadeOutMessage = useEffect(() => {
    if (pasted) {
      setTimeout(() => setPasted((prev) => false), 5000);
    }
  }, [pasted]);
  const handlePaste = (e) => {
    e.preventDefault();
    setPasted((prev) => true);
  };
  return (
    <>
      <input
        onPaste={handlePaste}
        disabled={iHaveFinished}
        value={input}
        onChange={handleInputChange}
        placeholder="Type Here..."
        className="track-input pr-6 web-body border-b-4 border-primary-b outline-none web-text w-full"
      />
      <br></br>

      {pasted && (
        <div className="space-x-2 mt-5">
          <IoWarning className="text-orange-400 inline" size={20} />
          <p className="text-sm text-orange-400 inline">Pasting not allowed.</p>
        </div>
      )}
    </>
  );
};
export default TrackInput;
