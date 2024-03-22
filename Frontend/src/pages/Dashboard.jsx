import { useContext, useEffect, useState } from "react";
import Statistics from "@/components/Statistics";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { backendUrl } from "../../config/config";
const Dashboard = () => {
  document.title = "Dashboard | Type Rivals";
  const [data, setData] = useState({});
  const { token } = useContext(AuthContext);
  console.log(data);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getUserDashboard() {
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        },
        signal,
      };

      const response = await axios.get(`${backendUrl}/user/dashboard`, options);

      if (response.status === 200) {
        const data = await response.data;
        console.log(data);
        setData(data);
      }
    }
    getUserDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="dashboard-section w-full max-w-[45rem]">
      <div className="dashboard-container w-full  pt-[5rem]">
        <p className="web-text  w-full text-center md:text-left font-semibold leading-[2rem]">
          User Rapsheet
        </p>

        <div className="rap-sheet w-full flex flex-col md:flex-row h-full items-center justify-center md:justify-between">
          <Statistics data={data} />
        </div>
        <div className="profile-tools w-full mx-auto max-w-[20rem] md:max-w-full  h-[2rem] bg-skin-foreground pt-1 mt-2">
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
export default Dashboard;
