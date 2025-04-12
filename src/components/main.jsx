import { Routes, Route } from "react-router-dom";
import PlanillaMasculino from "./planilla";
import PlanillaFemenino from "./planillaFem";
import Home from "./home";
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
            </Routes>
       
    );
}

export default Main;
