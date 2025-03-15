import React from "react";
import { Container, HeaderContainer } from "./styles";
import { FaClipboardList } from "react-icons/fa";
import {  IAxis } from "../../../types";
import { Table, Tag } from "antd";
import { alumnColorGradeMap } from "../../../utils/maps/color";
import { alumnGradeMap } from "../../../utils/maps/status";

interface GradesCardProps {
  axis?: IAxis | [] | undefined
  alumnsAndGrades: {
    name: string
    grade: string
  }[]
  children?: any
}


const gradesColumns = [
  {
    title: "Aluno",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Nota",
    dataIndex: "grade",
    key: "grade",
  },
  {
    title: "Situação",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
      color={alumnColorGradeMap[status]}
      style={{
        width: "50%",
        textAlign: "center",
        borderRadius: ".5rem",
        fontSize: "16px",
      }}
      key={status}
    >
      {alumnGradeMap[status]}
    </Tag>
    ),
  },
  
]

const GradesCard: React.FC<GradesCardProps> = ({ alumnsAndGrades, children }) => {
  

  return (
    <Container>
    <HeaderContainer>      
        <FaClipboardList size={30} color='#2d76b2' style={{margin: '20px'}} />      
   
        <h3>Notas</h3>
        
    </HeaderContainer>
    <Table
      columns={gradesColumns}
      dataSource={alumnsAndGrades.map((alumn, index) => {
        return {
          key: (index + 1).toString(),
          number: alumnsAndGrades?.length
            ? alumnsAndGrades.length - index
            : 0,
          name: alumn.name,
          grade: alumn.grade,
          status: parseFloat(alumn.grade?.replace(",",".")) >= 7.0 ? 'approved' : 'reproved',
          
        };
      })}
      pagination={{ pageSize: 200, position: ['none', 'none']}}
      style={{ width: "100%", height: "100%" }}
    />
      {children}
    </Container>
  );
};

export default GradesCard;
