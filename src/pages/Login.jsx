import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';
import AnimatedGlow from '../components/AnimatedGlow';

export default function Login() {
    return (
        <div className="min-h-screen bg-fm-bg flex flex-col">
            <div className="relative overflow-hidden flex-1">
                <AnimatedGlow />
                <Navbar />
                <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 md:py-16">
                    <div className="mb-8 text-center">
                        <h1 className="font-sans text-[32px] font-bold leading-[1.15] text-fm-white sm:text-[44px] md:text-[56px]">
                            Welcome Back
                        </h1>
                        <p className="mx-auto mt-4 max-w-md text-base text-fm-silver sm:text-lg md:text-xl">
                            Sign in to manage your finances smarter.
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
            <Footer />
        </div>
    );
}