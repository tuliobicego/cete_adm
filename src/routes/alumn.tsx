import React from "react";
import { Routes, Route } from "react-router";
import Nav from "../components/templates/Nav";
import AlumnProfile from "../pages/alumnProfile/alumnProfile";

const AlumnRoutes: React.FC = () => {
  return (
    <Nav>
      <Routes>
          <Route path="/alumnProfile">
            <Route path="/alumnProfile" element={<AlumnProfile/>}/>
          </Route>
      </Routes>
    </Nav>
  );
};

export default AlumnRoutes;
