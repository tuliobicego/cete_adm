import React from "react";
import { Routes, Route } from "react-router";
import Nav from "../components/templates/Nav";
import Alumns from "../pages/alumns/alumns";
import Axis from "../pages/axis/axis";
import Lessons from "../pages/lessons/lessons";
import Professors from "../pages/professors/professors";
import ProfessorProfile from "../pages/professorProfile/professorProfile";
import PaymentDetails from "../pages/paymentDetails/paymentDetails";
import LessonDetails from "../pages/lessonDetails/lessonDetails";
import AxisDetails from "../pages/axisDetails/axisDetails";
import AlumnProfile from "../pages/alumnProfile/alumnProfile";
import Panel from "../pages/panel/panel";
import CreateAlumnEnrolled from "../pages/createAlumnEnrolled/createAlumnEnrolled";

const SecretaireRoutes: React.FC = () => {
  return (
    <Nav>
      <Routes>
          <Route path="/" element={<Panel/>}/>
          <Route path="/panel" element={<Panel/>}/>
          <Route path="/alumns" element={<Alumns/>}/>
          <Route path="/alumnProfile" element={<AlumnProfile/>}/>
          <Route path="/createAlumnEnrolled" element={<CreateAlumnEnrolled/>}/>
          <Route path="/axis" element={<Axis/>}/>
          <Route path="/axisDetails" element={<AxisDetails/>}/>
          <Route path="/lessonDetails" element={<LessonDetails/>}/>
          <Route path="/lessons" element={<Lessons/>}/>
          <Route path="/paymentDetails" element={<PaymentDetails/>}/>
          <Route path="/professors" element={<Professors/>}/>
          <Route path="/professorProfile" element={<ProfessorProfile/>}/>
            
      </Routes>
    </Nav>
  );
};

export default SecretaireRoutes;
