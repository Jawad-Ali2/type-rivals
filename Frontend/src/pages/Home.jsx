import  StatBar  from "@/components/StatBar";
import { Button } from "@/components/ui/button";
const Home = () => {
  document.title = "Home | Type Rivals";
  const top_racers = [
    { date_or_rank: "01", title: "Zaid Bin Zaheer", speed: 529 },
    { date_or_rank: "02", title: "Eren Yeager", speed: 525 },
    { date_or_rank: "03", title: "Jawad Ali", speed: 2 },
  ];
  const upcoming_events = [
    { date_or_rank: "May 26", title: "Weekly Cup" },
    { date_or_rank: "Jun 28", title: "Ziest Triger III Cup" },
    { date_or_rank: "Aug 14", title: "Punctuation Masters Cup" },
  ];
  return (
    <section className="home-section w-full max-w-[45rem]">
      <div className="home-container pt-[5rem] w-full">
        <div className="rankings-events-container flex flex-wrap w-full flex-col items-center justify-between md:flex-row">
          <div className="rankings-container mt-5">
            <p className="web-text font-semibold">Top Racers</p>
            <ul className="rank-list">
              {top_racers.map((racer, i) => (
                <li key={i} className="my-2">
                  <StatBar {...racer} />
                </li>
              ))}
            </ul>
          </div>
          <div className="events-container mt-5">
            <p className="web-text font-semibold">Upcoming Events</p>
            <ul className="event-list">
              {upcoming_events.map((event, i) => (
                <li key={i} className="my-2">
                  <StatBar {...event} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="cta-btns mt-10 flex flex-col h-[10rem] w-full justify-between items-center md:items-start">
          <p className="web-text font-semibold">Join the Fun</p>
          <button className="web-button">Quick Race &gt;</button>
          <button className="web-button">Tournaments &gt;</button>
        </div>
      </div>
    </section>
  );
};
export default Home;