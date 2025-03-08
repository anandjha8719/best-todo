// src/App.jsx
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar";
import TodoContent from "./components/TodoContent";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Sidebar />
        <TodoContent />
        {/* <div>helo</div> */}
      </main>
    </div>
  );
}

export default App;
