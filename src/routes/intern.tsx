import React from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "../components/templates/Nav";

const InternRoutes: React.FC = () => {
  return (
    <Nav>
      <Routes>
          <Route path="/" element={'OI'}>
            
          </Route>
      </Routes>
    </Nav>
  );
};

export default InternRoutes;
