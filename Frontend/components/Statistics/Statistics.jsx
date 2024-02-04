import default_dp from "/src/assets/Default_dp.png";
export const Statistics = ({ data }) => {
  const statistics = Object.entries({
    Name: data.name,
    Email: data.email,
    Age: data.age,
    // Races: data.races,
    Wins: data.raceDetail?.wins,
    Losses: data.raceDetail?.loses,
    "Avg. Speed": data.raceDetail?.avgSpeed,
    "Max Speed": data.raceDetail?.maxSpeed,
  });
  return (
    <section className="statistics-section">
      <div className="statistics-container  w-full flex flex-col md:flex-row justify-center md:justify-between items-center">
        <div className="dp-container h-[10rem] w-[10rem] md:w-[15rem] web-foreground">
          <img className="h-full" src={default_dp} />
        </div>
        <div className="stats-container w-full min-w-[20rem] md:min-w-[28rem] h-[10rem] web-foreground mt-5 md:mt-0 md:ml-[2rem]  p-2">
          <table>
            <tbody>
              <tr>
                <th className="w-[8rem]"></th>
                <th></th>
              </tr>
              {statistics.map(([key, value], i) => (
                <tr key={i}>
                  <td className="web-text font-semibold text-sm">{key}</td>
                  <td className="web-text font-semibold text-sm">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
