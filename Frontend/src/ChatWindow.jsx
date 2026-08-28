import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./auth-context.js";
import API_URL from "./api.js";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    refreshThreads,
  } = useContext(MyContext);
  const { user, guest, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getReply = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    setLoading(true);
    setError("");
    setPrompt("");
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        threadId: currThreadId,
        message,
      }),
    };
    try {
      const response = await fetch(
        `${API_URL}/api${guest ? "/guest-chat" : "/chat"}`,
        options,
      );
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Unable to get a response");
      }
      setReply(res.reply);
      setPrevChats((previousChats) => [
        ...previousChats,
        { role: "user", content: message },
        { role: "assistant", content: res.reply },
      ]);
      if (user) await refreshThreads();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div className="userActions">
          <button className="logoutButton" type="button" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Log Out
          </button>
        </div>
      </div>

      <Chat></Chat>
      <ScaleLoader color="#fff " loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getReply();
              }
            }}
          ></input>

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        {error && <p className="chatError">{error}</p>}
        <p className="info">
          sigmaGPT can make mistakes. Check important info. See cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
