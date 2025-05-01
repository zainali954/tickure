import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/s1.jpeg";
import { ArrowRight02Icon } from "hugeicons-react";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";

const fadeInZoom = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1.05,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Home = () => {
  return (
    <main className="min-h-screen relative flex flex-col overflow-x-hidden">
      {/* Decorative Grid Background */}
      <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>

      {/* Header */}
      <header className="w-full border-b bg-white bg-opacity-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src={logo} alt="Tickure Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold text-zinc-900">tickure</span>
          </Link>

          {/* Login Button */}
          <Link to="/login">
            <button className="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-24 flex flex-col items-center text-center">
        <motion.h1
          variants={fadeInZoom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6"
        >
          Stay Focused. Get Things Done.
        </motion.h1>

        <motion.p
          variants={fadeInZoom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8"
        >
          Tickure is your personal productivity sidekick — built for clarity, not clutter.
        </motion.p>

        <motion.div
          variants={fadeInZoom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Link to="/signup">
            <button className="text-base sm:text-lg flex items-center gap-2 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Start Your Journey
              <ArrowRight02Icon className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-20 w-full"
        >
          <img
            src={heroImage}
            alt="Organized workspace illustration"
            className="max-w-4xl w-full mx-auto rounded-2xl shadow-xl transition duration-300 hover:scale-[1.02]"
          />
        </motion.div>
      </section>

      {/* Why Tickure Section */}
      <motion.section
        variants={fadeInZoom}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full py-20 border-t"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
            Tickure is not for teams — it's for you.
          </h2>
          <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto">
            Whether you're managing college deadlines, planning your personal goals,
            or just tracking tasks for peace of mind — Tickure adapts to your flow, not the other way around.
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t bg-gray-50">
        &copy; {new Date().getFullYear()} Tickure. Built with clarity, not complexity.
      </footer>
    </main>
  );
};

export default Home;
