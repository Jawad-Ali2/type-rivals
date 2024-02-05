import { AuthForm } from "../../components"
export const Auth = ()=>{
    return <section className="auth-section w-full max-w-[45rem]">
        <div className="auth-container w-full pt-[5rem]">
            <AuthForm signIn={true}/>
        </div>
    </section>
}