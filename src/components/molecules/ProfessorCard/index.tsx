import React from "react";
import { IProfessor } from "../../../types/professor";
import { professorStatusMap } from "../../../utils/maps/status";
import { Container, Info } from "./styles";
import { Tag } from "antd";
import { professorColorStatusMap } from "../../../utils/maps/color";
interface ProfessorCardProps {
  professor: IProfessor;
  children?: any
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  professor,
  children,
}) => {
  return (
    <Container>
      <Info>
        <h2>{professor.name}</h2>
      </Info>
      <Info>E-mail: {professor.email}</Info>
      <Info>
        <Tag
          color={professorColorStatusMap[professor.status]}
          style={{
            width: "50%",
            textAlign: "center",
            borderRadius: ".5rem",
            fontSize: "16px",
          }}
          key={professor.status}
        >
          Status: {professorStatusMap[professor.status]}
        </Tag>
      </Info>
      {children}
    </Container>
  );
};

export default ProfessorCard;
