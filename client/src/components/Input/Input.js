import React from "react";
import "./Input.css";

const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <form>
      <input
        className="input"
        type="text"
        placeholder="Enter a message"
        value={message}
        onKeyPress={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
        onChange={(event) => setMessage(event.target.value)}
      />
      <button className="sendButton" onClick={(event) => sendMessage(event)}>
        Send
      </button>
    </form>
  );
};

export default Input;
