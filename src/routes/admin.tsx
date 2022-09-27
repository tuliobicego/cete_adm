import React from "react";
import { Routes, Route } from "react-router";
import Nav from "../components/templates/Nav";

const AdminRoutes: React.FC = () => {
  return (
    <Nav>
      <Routes>
          <Route path="/dashboard" >
            HELLO ADM
          </Route>
      </Routes>
    </Nav>
  );
};

export default AdminRoutes;
