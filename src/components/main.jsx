import { Routes, Route } from "react-router-dom";
import PlanillaMasculino from "./planilla";
import PlanillaFemenino from "./planillaFem";
import Home from "./home";
import Fixture from "./fixture";
import FixtureCrear from "./fixtureForm";
function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planillaMasculino" element={<PlanillaMasculino />} />
      <Route path="/planillaFemenino" element={<PlanillaFemenino />} />
      <Route path="/fixture" element={<Fixture />} />
      <Route path="/fixture/cargar" element={<FixtureCrear />} />
    </Routes>
  );
}

export default Main;
