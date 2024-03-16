import  Card  from "@/components/Card";
const Landing = ()=>{
    document.title="Type Rivals"
    const Card1 = {
        title:"Improve Speed",
        body:"Challenge various online players, and compete to keep improving your typing speed. Alternatively, go up against our typing bots and see if you can topple them all.",
        link:"/dashboard",
        button_text:"Practice with Bots"
    }
    const Card2 = {
        title:"Quick Race",
        body:"Join a quick race, and test your skills against your opponents, you’ll be competing against a maximum of 4 players. An efficient way to increase your typing speed",
        link:"/dashboard",
        button_text:"Quick Race"
    }
    const Card3= {
        title:"Death Match",
        body:"Join a death match race, one mistake and you’ll be out of the race, you’ll be pitted against 4 opponents at max. An efficient way to improve your typing accuracy.",
        link:"/dashboard",
        button_text:"Join a Death Match"
    }
    return <section className="landing-section w-full">
        <div className="landing-container w-full h-full mt-[3rem] text-center">
            <p className="web-text text-[28px] font-semibold">Type Rivals</p>
            <ul className="card-list w-[20rem] mx-auto md:w-full h-full flex flex-wrap flex-col md:flex-row items-center justify-center">
                <li className="mt-10 md:mx-4"><Card {...Card1}/></li>
                <li className="mt-10 md:mx-4"><Card {...Card2}/></li>
                <li className="mt-10 md:mx-4"><Card {...Card3}/></li>
            </ul>
        </div>
    </section>
}
export default Landing;