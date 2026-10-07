import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackgroundNebulae from "@/components/ui/BackgroundNebulae";

export default function Home() {
  return (
    <>
      {/* Slowly drifting background nebulae */}
      <BackgroundNebulae />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="w-full min-h-screen bg-transparent text-zinc-100 flex flex-col relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Corporate Services & Solutions */}
        <Services />

        {/* Selected Works Bento Showcase */}
        <Projects />

        {/* Skills & Tools Categorization Matrix */}
        <TechStack />

        {/* Multidisciplinary Team Structure */}
        <Team />

        {/* Contact Form Details */}
        <Contact />
      </main>

      {/* Footer Details */}
      <Footer />
    </>
  );
}
