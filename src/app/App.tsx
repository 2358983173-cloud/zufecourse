import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { router } from "./routes";
import "../styles/theme.css";
import zufeLogo from "../assets/zufe-logo.webp";
import { initializeCourseState } from "./course-state";
import { getAuthUser } from "./api";
import { state } from "./data";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const enterApp = () => setShowSplash(false);

  useEffect(() => {
    initializeCourseState();
    const user = getAuthUser();
    if (user) {
      state.isLoggedIn = true;
      state.user.name = user.nickname;
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <AnimatePresence>
        {showSplash && (
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="点击进入浙江财经大学金融学专业选课助手"
            onClick={enterApp}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") enterApp();
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-[999] flex cursor-pointer items-center justify-center bg-[#f7f9fc]"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="flex flex-col items-center px-8 text-center"
            >
              <motion.img
                src={zufeLogo}
                alt="浙江财经大学"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                className="w-72 max-w-[82vw] object-contain"
              />

              <motion.p
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10 text-xs font-black text-[#173b83]"
              >
                点击进入
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
