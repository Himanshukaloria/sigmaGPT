import "./Sidebar.css";
import blacklogo from "./assets/blacklogo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from "uuid";
import API_URL from "./api.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    refreshThreads,
  } = useContext(MyContext);

  useEffect(() => {
    refreshThreads().catch(() => undefined);
  }, [refreshThreads]);

  const createNewChat = () => {
    refreshThreads().catch(() => undefined);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    if (!newThreadId) return;
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
        credentials: "include",
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Unable to load this thread");
      }
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.error || "Unable to delete this thread");
      }

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src={blacklogo} alt="gpt logo" className="logo"></img>
        <span>
          <i className="fa-regular fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>
          By Himanshu <i className="fa-sharp fa-solid fa-heart" id="heart"></i>
        </p>
      </div>
    </section>
  );
}

export default Sidebar;
