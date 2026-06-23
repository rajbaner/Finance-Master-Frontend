import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';
import AnimatedGlow from '../components/AnimatedGlow';

export default function Landing() {
  return (
    <div className="min-h-screen bg-fm-bg flex flex-col">
      <div className="relative overflow-hidden flex-1">
        <AnimatedGlow />
        <Navbar />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6">
          <Hero />
        </div>

        <div className="relative z-10 mx-auto w-[1400px] max-w-full px-6 pb-16">
          <SignupForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}