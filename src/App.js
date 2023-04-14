import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CarDetails from "./components/CarDetails";
import CreateCar from "./components/CreateCar";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path={"/"} element={<Login />} />
        <Route exact path={"/dashboard"} element={<Dashboard />} />
        <Route exact path={"/car"} element={<CarDetails />} />
        <Route exact path={"/create"} element={<CreateCar />} />
      </Routes>
    </Router>
  );
}

export default App;
