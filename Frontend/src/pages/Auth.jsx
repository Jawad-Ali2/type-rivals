import  AuthForm  from "@/components/AuthForm"
const Auth = ()=>{
    return <section className="auth-section w-full max-w-[45rem]">
        <div className="auth-container w-full pt-[5rem]">
            <AuthForm signIn={true}/>
        </div>
    </section>
}
export default Auth;