import { Routes, Route } from "react-router-dom";
import PlanillaMasculino from "./planilla";
import PlanillaFemenino from "./planillaFem";
import Home from "./home";
import Fixture from "./fixture";
function Main() {
    return (
      
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/planillaMasculino"
                    element={<PlanillaMasculino />}
                />
                <Route
                    path="/planillaFemenino"
                    element={<PlanillaFemenino />}
                />
                 <Route
                    path="/fixture"
                    element={<Fixture />}
                />
            </Routes>
       
    );
}

export default Main;
