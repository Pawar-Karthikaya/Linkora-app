import { useState } from "react";

function chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;

    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div>
      <div
        style={{
          height: "300px",
          overflow: "scroll",
          border: "1px solid black",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg} </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default chat;    