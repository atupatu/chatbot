import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      text: 'Hey Welcome to Hooked!\nShare your email or login',
      sender: 'bot',
      type: 'text-and-button',
      buttonLink: 'http://localhost:5000/auth/google',
      buttonText: 'Authenticate with Google',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user', type: 'text' };
      setMessages([...messages, newMessage]);
      setInput('');

      try {
        const response = await axios.post('http://localhost:5000/api/chat', {
          message: input,
        });

        if (response.status === 200) {
          const data = response.data;
          const botMessage = {
            text: data.reply,
            sender: 'bot',
            type: data.type || 'text', // Use type from response if provided, default to 'text'
            buttonText: data.buttonText, // Include buttonText from response if provided
            buttonLink: data.buttonLink, // Include buttonLink from response if provided
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="App">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === 'text' && <span>{msg.text}</span>}
            {msg.type === 'button' && (
              <a href={msg.buttonLink} className="link-button" target="_blank" rel="noopener noreferrer">
                {msg.buttonText}
              </a>
            )}
            {msg.type === 'text-and-button' && (
              <div className="text-and-button">
                <span>{msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}</span>
                <a href={msg.buttonLink} className="link-button" target="_blank" rel="noopener noreferrer">
                  {msg.buttonText}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
