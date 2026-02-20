import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Navigation";

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
import Admin from "./pages/Admin";


const AppContent = () => {
  const { activePage, setActivePage } = useApp();

  const renderPage = () => {
    switch (activePage) {

      case "AUTH":
        return (
          <Auth
            onLogin={() => setActivePage("DASHBOARD")}
            onSignupClick={() => setActivePage("SIGNUP")}
          />
        );

      case "SIGNUP":
        return (
          <Signup onSuccess={() => setActivePage("AUTH")} />
        );

      case "PROFILE": return <Profile />;

      case "CHATBOT": return <Chatbot />;
      case "JOURNAL": return <Journal />;
      case "BREATHE": return <Breathing />;
      case "FOCUS": return <Pomodoro />;
      case "SLEEP": return <Sleep />;
      case "PEER": return <Forum />;
      case "COUNSELING": return <Booking />;
      case "ADMIN": return <Admin />;
      case "GAMES": return <Games />; 
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      {activePage !== "AUTH" && activePage !== "SIGNUP" && <Sidebar />}

      {/* Main Content */}
      <main
  className={`flex-1 p-6 overflow-y-auto h-screen pb-24 ${
    activePage !== "AUTH" && activePage !== "SIGNUP"
      ? "md:ml-64"
      : ""
  }`}
>
        {renderPage()}
      </main>

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
