import Dashboard from "./Dashboard";
import Login from "./Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? (
    <div>
      <Dashboard code={code} />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  ) : (
    <Login />
  );
}

export default App;
