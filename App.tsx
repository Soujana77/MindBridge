import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Navigation";
import FloatingTimer from "./components/FloatingTimer";
import LandingPage from "./landing/LandingPage";

// Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Games from "./pages/Games";
import Chatbot from "./pages/Chatbot";
import Journal from "./pages/Journal";
import Breathing from "./pages/Breathing";
import Pomodoro from "./pages/Pomodoro";
import Sleep from "./pages/Sleep";
import Forum from "./pages/Forum";
import Booking from "./pages/Booking";

const AppContent = () => {
  const { activePage, setActivePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case "LANDING":
        return <LandingPage onGetStarted={() => setActivePage("AUTH")} />;
      case "AUTH":
        return (
          <Auth
            onLogin={() => setActivePage("DASHBOARD")}
            onSignupClick={() => setActivePage("SIGNUP")}
          />
        );

      case "SIGNUP":
        return <Signup onSuccess={() => setActivePage("AUTH")} />;

      case "PROFILE":
        return <Profile />;

      case "CHATBOT":
        return <Chatbot />;
      case "JOURNAL":
        return <Journal />;
      case "BREATHE":
        return <Breathing />;
      case "FOCUS":
        return <Pomodoro />;
      case "SLEEP":
        return <Sleep />;
      case "PEER":
        return <Forum />;
      case "COUNSELING":
        return <Booking />;

      case "GAMES":
        return <Games />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      {!["AUTH", "SIGNUP", "LANDING"].includes(activePage) && (
        <Sidebar />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto h-screen ${!["AUTH", "SIGNUP", "LANDING"].includes(activePage)
          ? `md:ml-64 p-6 ${activePage === 'CHATBOT' ? 'pb-2' : 'pb-24'}`
          : ""
          }`}
      >
        {renderPage()}
      </main>

      {/* 🌟 FLOATING MINI TIMER — GLOBAL */}
      {!["AUTH", "SIGNUP", "LANDING"].includes(activePage) && (
        <FloatingTimer />
      )}

    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;