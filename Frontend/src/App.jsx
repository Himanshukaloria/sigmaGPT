import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "./auth-context.js";
import API_URL from "./api.js";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const refreshThreads = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/thread`, {
      credentials: "include",
    });
    const threads = await response.json();
    if (!response.ok) {
      throw new Error(threads.error || "Unable to load chat history");
    }

    setAllThreads(
      threads.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
        updatedAt: thread.updatedAt,
      })),
    );
  }, []);

  const { user, guest, loading, continueAsGuest } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    refreshThreads,
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!user && !guest) {
    return showLogin ? (
      <Login
        switchToSignup={() => setShowLogin(false)}
        continueAsGuest={continueAsGuest}
      />
    ) : (
      <Signup switchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        {user && <Sidebar></Sidebar>}
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;
