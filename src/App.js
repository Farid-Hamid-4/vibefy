import Dashboard from "./Dashboard";
import Login from "./Login";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? (
    <div>
      <Dashboard code={code}/>
    </div>
  ) : (
    <Login />
  );
}

export default App;
