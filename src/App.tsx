import { Outlet } from "react-router-dom"
import NavBar from "./components/NavBar.tsx";

function App() {


  return (
    <>
    <div className="container">
      <NavBar />
    <Outlet />
    </div>

    </>
  )
}

export default App
