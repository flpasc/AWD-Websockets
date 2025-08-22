import ChatComponent from "./components/ChatComponent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to chat</h1>
      <ChatComponent />
    </div>
  );
}
