import { useContext, useEffect, useState } from "react";
import { Statistics } from "../../components";
import { AuthContext } from "../../context/AuthContext";
export const Dashboard = () => {
  const [data, setData] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function getUserDashboard() {
      const response = await fetch("http://localhost:8000/user/dashboard", {
        headers: { Authorization: "Bearer " + token },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
      }
    }
    getUserDashboard();
  }, []);

  document.title = "User Dashboard";
  // const data = {
  //     NAME: "SLIM SHADY",
  //     AGE: 45,
  //     RACES: 108,
  //     WINS : 56,
  //     LOSES: 52,
  //     "AVG. SPEED": "75 WPM",
  //     "MAX SPEED": "98 WPM"
  // }
  return (
    <section className="dashboard-section w-full max-w-[45rem]">
      <div className="dashboard-container w-full  pt-[5rem]">
        <p className="web-text  w-full text-center md:text-left font-semibold leading-[2rem]">
          User Rapsheet
        </p>

        <div className="rap-sheet w-full flex flex-col md:flex-row h-full items-center justify-center md:justify-between">
          <Statistics data={data} />
        </div>
        <div className="profile-tools w-full mx-auto max-w-[20rem] md:max-w-full  h-[2rem] web-foreground pt-1 mt-2">
          <ul className="w-full">
            {["Edit Profile", "Privacy & Security", "My Cars"].map(
              (user, i) => (
                <li
                  key={i}
                  className="inline web-text text-sm font-semibold mx-2"
                >
                  {user}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};
