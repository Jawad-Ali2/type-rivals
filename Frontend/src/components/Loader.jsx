import PulseLoader from "react-spinners/PulseLoader";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
const Loader = ({ loading, size }) => {
  const { theme } = useContext(ThemeContext);
  const getColor = () => {
    if (theme === "light") return "#000";
    else if (theme === "dark") return "#0d2844";
    return "white";
  };
  return <PulseLoader loading={loading} color={getColor()} size={size} />;
};
export default Loader;
