import { createHashRouter, Outlet, useLocation } from "react-router";
import { EntryPage } from "./pages/entry";
import { LoginPage } from "./pages/login";
import { Home } from "./pages/home";
import { CourseList } from "./pages/course-list";
import { CourseDetail } from "./pages/course-detail";
import { SchedulePage } from "./pages/schedule";
import { ProfilePage } from "./pages/profile";
import { HeatPage } from "./pages/heat";
import { RecommendationFlow } from "./pages/recommendation-flow";
import { RecommendationResult } from "./pages/recommendation-result";
import { BottomNav, DesktopSidebar } from "./components/layout";
import { AnimatePresence } from "motion/react";

const Root = () => {
  const location = useLocation();
  const hideNav = ["/", "/login", "/recommendation"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col lg:pl-64">
      {!hideNav && <DesktopSidebar />}
      <main className="flex-grow min-w-0">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LoginPage },
      { path: "entry", Component: EntryPage },
      { path: "login", Component: LoginPage },
      { path: "home", Component: Home },
      { path: "courses", Component: CourseList },
      { path: "course/:id", Component: CourseDetail },
      { path: "schedule", Component: SchedulePage },
      { path: "heat", Component: HeatPage },
      { path: "profile", Component: ProfilePage },
      { path: "recommendation", Component: RecommendationFlow },
      { path: "recommendation-result", Component: RecommendationResult },
    ],
  },
]);
