import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "./auth-context.js";
import API_URL from "./api.js";
import Login from "./Login.jsx"; // ← add karo
import Signup from "./Signup.jsx"; // ← add karo

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
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

  const { user, loading } = useContext(AuthContext); // ← add karo
  const [showLogin, setShowLogin] = useState(true); // ← add karo (login/signup toggle)

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
    return <div className="app-loading">Loading...</div>; // ← add karo
  }

  if (!user) {
    // ← add karo
    return showLogin ? (
      <Login switchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup switchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;

// import "./App.css";
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv4());
//   const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]);

//   const providerValues = {
//     prompt,
//     setPrompt,
//     reply,
//     setReply,
//     currThreadId,
//     setCurrThreadId,
//     newChat,
//     setNewChat,
//     prevChats,
//     setPrevChats,
//     allThreads,
//     setAllThreads,
//   };

//   return (
//     <div className="app">
//       <MyContext.Provider value={providerValues}>
//         <Sidebar></Sidebar>
//         <ChatWindow></ChatWindow>
//       </MyContext.Provider>
//     </div>
//   );
// }

// export default App;
