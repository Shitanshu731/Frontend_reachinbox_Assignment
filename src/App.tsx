import React, { JSX } from "react";
import { EmailList } from "./components/EmailList";
import { motion } from "framer-motion";
import "./App.css";

function App(): JSX.Element {
  return (
    <div className="App">
      <motion.header
        className="App-header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1>📬 Onebox Email Aggregator</h1>
        <p className="tagline">
          Manage, search, and organize all your emails — unified in one powerful
          dashboard.
        </p>
        <div className="meta">
          <span>
            🔧 Assignment by <strong>Reachinbox.ai</strong>
          </span>
          <span>
            🧠 Made by <strong>Shitanshu Sahu</strong>
          </span>
        </div>
      </motion.header>

      <main>
        <EmailList />
      </main>

      <footer className="footer">
        <p>
          Built for productivity and simplicity. Empowered by React + Express +
          Typescript + Nodejs.
        </p>
        <p>
          &copy; {new Date().getFullYear()} Shitanshu | All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
