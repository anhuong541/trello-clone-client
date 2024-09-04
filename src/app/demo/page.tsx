"use client";

import { useState } from "react";
import { useChannel } from "ably/react";

const Component = () => {
  const [messages, updateMessages] = useState<any[]>([]);
  const { channel } = useChannel("message", (message: any) => {
    console.log({ message });
    updateMessages([...messages, message.data.text]);
  });

  const sendMessage = () => {
    channel.publish({ name: "myEventName", data: { text: "Some random stuff here." } });
  };

  return (
    <main>
      <button onClick={(e) => sendMessage(e)}>Click here to send a message</button>
      <h2>Messages will go here:</h2>
      <ul>
        {messages.map((text: string, index) => (
          <li key={"item" + index}>{text}</li>
        ))}
      </ul>
    </main>
  );
};

export default Component;
