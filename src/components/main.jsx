import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PlanillaFemenino from "./planillaFem";
import PlanillaMasculino from "./planilla";
import Home from "./home";
function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/planillaMasculino"
                    element={<PlanillaMasculino />}
                />
                {/* <Route
                    path="/planillaFemenino"
                    element={<PlanillaFemenino />}
                /> */}
            </Routes>
        </Router>
    );
}

export default Main;
