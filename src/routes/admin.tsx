import React from "react";
import { Routes, Route } from "react-router";
import Nav from "../components/templates/Nav";
import Panel from "../pages/panel/panel";
import Alumns from "../pages/alumns/alumns";
import AlumnProfile from "../pages/alumnProfile/alumnProfile";
import Axis from "../pages/axis/axis";
import Lessons from "../pages/lessons/lessons";
import Payments from "../pages/payments/payments";
import Professors from "../pages/professors/professors";
import ProfessorProfile from "../pages/professorProfile/professorProfile";
import AxisDetails from "../pages/axisDetails/axisDetails"
import LessonDetails from "../pages/lessonDetails/lessonDetails"
import PaymentDetails from "../pages/paymentDetails/paymentDetails"
import CreateAlumnEnrolled from "../pages/createAlumnEnrolled/createAlumnEnrolled";

const AdminRoutes: React.FC = () => {
  return (
    <Nav>
      <Routes>
        <Route path="/" element={<Panel/>}/>
          <Route path="/panel" element={<Panel/>}/>
          <Route path="/alumns" element={<Alumns/>}/>
          <Route path="/createAlumnEnrolled" element={<CreateAlumnEnrolled/>}/>
          <Route path="/alumnProfile" element={<AlumnProfile/>}/>
          <Route path="/axis" element={<Axis/>}/>
          <Route path="/axisDetails" element={<AxisDetails/>}/>
          <Route path="/lessonDetails" element={<LessonDetails/>}/>
          <Route path="/lessons" element={<Lessons/>}/>
          <Route path="/payments" element={<Payments/>}/>
          <Route path="/paymentDetails" element={<PaymentDetails/>}/>
          <Route path="/professors" element={<Professors/>}/>
          <Route path="/professorProfile" element={<ProfessorProfile/>}/>
      </Routes>
    </Nav>
  );
};

export default AdminRoutes;
