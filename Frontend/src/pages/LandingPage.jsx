import { motion } from "framer-motion";
import heroImg from "@/assets/hero-section.jpg";
import shoppingImage from "@/assets/shopping-image.png";
import { Link } from "react-router";
// import CustomerLoginPage from "@/pages/LoginPage";
// import CustomerRegisterPage from "@/pages/customerRegisterPage";
// import VendorRegisterPage from "@/pages/VendorRegisterPage"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } },
};

// smooth scroll handler (fixes navbar offset)
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const yOffset = -80; // navbar height offset
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
};

export default function LandingPage() {
  return (
    <div className="font-sans bg-[#0B0F1A] text-white overflow-x-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className="flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 px-6 py-3 shadow-lg">
            
            {/* LOGO */}
            <h1 className="text-lg font-semibold tracking-wide text-white">
              MarketPlace
            </h1>

            {/* NAV LINKS */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
              <button onClick={() => scrollToSection("home")} className="hover:text-white transition">Home</button>
              <button onClick={() => scrollToSection("features")} className="hover:text-white transition">Features</button>
              <button onClick={() => scrollToSection("explore")} className="hover:text-white transition">Explore</button>
              <button onClick={() => scrollToSection("sell")} className="hover:text-white transition">Sell</button>
              <button onClick={() => scrollToSection("faq")} className="hover:text-white transition">FAQs</button>
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-white/70 hover:text-white transition">
                Login
              </Link>
              <Link to="/customer/register" className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md hover:scale-105 transition">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center px-6">
        <img src={heroImg} className="absolute inset-0 w-full h-full object-cover opacity-20" />

        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl">
          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            A Smarter Way to Buy & Sell Online
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-white/70 text-lg leading-relaxed">
            Our platform empowers individuals and businesses to connect, trade, and grow effortlessly.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-4">
            <Link to="/customer/register" className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl">
              Get Started
            </Link>
            <Link onClick={() => {scrollToSection("explore")}} className="px-8 py-3 rounded-2xl border border-white/20 hover:bg-white/10">
              Explore Platform
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {["Fast & Reliable", "Secure by Design", "User-Centric Experience"].map((title, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.05 }} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition">
              <h3 className="text-2xl font-semibold mb-4">{title}</h3>
              <p className="text-white/60">
                Designed to deliver performance, security, and a seamless user experience.
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* EXPLORE */}
      <section id="explore" className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.img variants={fadeUp} src={shoppingImage} className="w-full md:w-1/2 rounded-3xl shadow-2xl" />

          <motion.div variants={fadeUp} className="md:w-1/2">
            <h2 className="text-5xl font-bold mb-6">Explore Products Effortlessly</h2>
            <p className="text-white/60 mb-6">
              Discover products with a smooth and engaging browsing experience.
            </p>
            <Link to="/customer/register" className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600">
              Start Exploring
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* SELL */}
      <section id="sell" className="py-24 px-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.img variants={fadeUp} src={shoppingImage} className="w-full md:w-1/2 rounded-3xl shadow-2xl" />

          <motion.div variants={fadeUp} className="md:w-1/2">
            <h2 className="text-5xl font-bold mb-6">Sell Smarter, Grow Faster</h2>
            <p className="text-white/60 mb-6">
              Expand your reach and manage your products efficiently.
            </p>
            <Link to="/vendor/register" className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600">
              Start Selling
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto space-y-4">
          {["How do I get started?", "Is it secure?", "How to sell?"].map((q, i) => (
            <motion.details key={i} variants={fadeUp} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <summary className="cursor-pointer font-medium text-lg">{q}</summary>
              <p className="mt-3 text-white/60">
                We provide a simple and secure process to help you get started quickly.
              </p>
            </motion.details>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-white/10 text-white/50">
        © 2026 Marketplace. All rights reserved.
      </footer>
    </div>
  );
}
