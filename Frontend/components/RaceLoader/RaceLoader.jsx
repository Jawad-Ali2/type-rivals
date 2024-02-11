import { Loader } from "../Loader/Loader";
import broken_link from "/src/assets/broken_link.png";

export const RaceLoader = ({ children, loading, errors, time }) => {
  const dynamicClass = `race-loader-container  flex flex-col justify-center items-center w-full z-[100] h-screen bg-black bg-opacity-50 top[5rem] left-0 ${
    time <= 0 ? "hidden" : "fixed"
  }`;
  return (
    <div className={dynamicClass}>
      {loading && !errors && (
        <>
          <Loader loading={loading} />
          <p className="text-white mt-5">{children}</p>
        </>
      )}
      {!loading && !errors && (
        <>
          <p className="text-white mt-5 text-6xl">{time}</p>
          <p className="text-white mt-5">Get Ready...</p>
        </>
      )}
      {errors && (
        <>
          <p className="text-white mt-5">Failed to Fetch</p>
        </>
      )}
    </div>
  );
};
