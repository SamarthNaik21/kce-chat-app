import { useEffect, useRef, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client'

const socket = io('https://sam-chat-backend.onrender.com')

function App() {

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const name = prompt("Enter your username:");
    setUsername(name || "Anonymous")

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    })
    
    return () => socket.off('chat message');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const send = () => {
    if(input.trim()){
      const msgData = { user: username, text: input};
      socket.emit('chat message', msgData);
      setInput('');
    }
  };

  return (
    <div className='chat-container'>
      <div className='chat-box'>
      <h2 className='chat-header'>💬 React Chat App</h2>
      <div className='message-list'>
        {messages.map((msg, index) => ( <div key={index} className={`message-bubble ${msg.user === username ? "my-message" : "other-message"}`}><strong className='user-label'>{msg.user}</strong><br/>{msg.text}</div>))}
      </div>
      <div ref={chatEndRef}/>
      <div className='input-container'>
      <input value={input} onChange={(e) => setInput(e.target.value)} 
      onKeyDown={(e) => e.key === "Enter" && send()}
      placeholder='Enter Message'
      className='chat-input'/>
      <button onClick={send} className='send-button'>Send</button>
      </div>
      </div>
    </div>
  )
}

export default App
