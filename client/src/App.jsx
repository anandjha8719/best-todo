// src/App.jsx
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import TodoContent from "./components/TodoContent";
import "./App.css";
import { UserProvider } from "./contexts/userContext";
import { TodoProvider } from "./contexts/todoContext";

function App() {
  return (
    <UserProvider>
      <TodoProvider>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <Sidebar />
            <TodoContent />
            {/* <div>helo</div> */}
          </main>
        </div>
      </TodoProvider>
    </UserProvider>
  );
}

export default App;
