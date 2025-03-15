import React, { useState } from "react";
import { FaPlus, FaSearch, FaTimes, FaUserTie } from "react-icons/fa";
import { IProfessor } from "../../../types/professor";
import IconButton from "../../atoms/IconButton";
import Input from "../../atoms/Input";
import CreateProfessorCard from "../../molecules/CreateProfessorCard";
import { ButtonsBox, FilterBox, Header } from "../styles";
import Select from "../../atoms/Select";
import { professorStatusMap } from "../../../utils/maps/status";
import { Table, Tag, Space, Tooltip } from "antd";
import { useNavigate } from "react-router";
import { professorColorStatusMap } from "../../../utils/maps/color";

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={professorColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {professorStatusMap[status]}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ getProfessor }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Perfil">
          <IconButton name="profile" onPress={getProfessor} icon={FaUserTie} />
        </Tooltip>
      </Space>
    ),
  },
];

interface ProfessorListProps {
  professors: IProfessor[];
  setProfessors(professors: IProfessor[]): void
  add: boolean;
  refresh(): void
}

const ProfessorList: React.FC<ProfessorListProps> = ({ professors, add, refresh, setProfessors }) => {
  const [content, setContent] = useState<"add" | "">("");
  const [filteredProfessor, setFilteredProfessors] = useState<
    IProfessor[] | undefined
  >(professors);
  const navigate = useNavigate();
  const professorAxisValues = [{ key: "", value: "Filtrar por turma" }].concat(
    professors.map((professor, i) => {
      if (professor.axis?.length) {
        return { key: professor.axis[professor.axis.length - i]._id, value: professor.axis[professor.axis.length - i].type};
      }
      return { key: "notFound", value: "Sem turma" };
    })
  );
  
  const professorStatusValues = [{ key: "", value: "Filtrar por status" }].concat(
    professors.map((professor) => {
      return { key: professor.status, value: professorStatusMap[professor.status] };
    })
  );
  
  const setFilteredByStatus = (key: string) => {
    key !== "notChosen"
      ? setFilteredProfessors(
          professors.filter((professor) => {
            return professor.status === key;
          })
        )
      : setFilteredProfessors(professors);
  };
  const setFilteredByAxis = (key: string) => {
    if (key === "") {
      setFilteredProfessors(professors);
      return;
    }
    if (key === "notFound") {
      setFilteredProfessors(
        professors.filter((professor) => {
          return !professor.axis;
        })
      );
      return;
    }
    setFilteredProfessors(
      professors?.filter((professor, i) => {
        return professor.axis && professor.axis[professor.axis.length - i]._id === key && 
        (professor.axis[professor.axis.length - i]._id === 'onCourse' || professor.axis[professor.axis.length - i]._id === 'scheduled') 
      })
    );
  };

  return (
    <Header>
      <h5 style={{ fontSize: "20px", width: "100%" }}>
        Professores encontrados: {filteredProfessor?.length}
      </h5>
      {add && content === "add" && (
        <IconButton
          name="addProfessor"
          icon={FaTimes}
          onPress={() => setContent("")}
        />
      )}
      <ButtonsBox>
        {content === "add" ? null : (
          <Input
            name="search"
            placeholder="Buscar pelo nome"
            icon={FaSearch}
            onChange={(e) => {
              setFilteredProfessors(
                professors?.filter((professor) => {
                  return professor.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase());
                })
              );
            }}
          />
        )}

        <FilterBox>
          {content === "add" ? <CreateProfessorCard refresh={refresh} professors={professors} setProfessors={setProfessors} /> : null}
          
          

          {content === "" && (
            <Select
              onSelect={setFilteredByStatus}
              options={[
                ...new Map(
                  professorStatusValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
          
        </FilterBox>
        {add && content === "" && (
          <IconButton
            name="addProfessor"
            icon={FaPlus}
            onPress={() => setContent("add")}
          />
        )}
      </ButtonsBox>
      {content === "" && filteredProfessor && (
        <Table
          columns={columns}
          dataSource={filteredProfessor?.map((professor, index) => {
            return {
              key: (index + 1).toString(),
              name: professor.name,
              status: professor.status,
              axis: professor.axis,
              getProfessor: () => {
                navigate( "/professorProfile", { state: {professorId: professor._id} });
              },
            };
          })}
          pagination={{ pageSize: 50 }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Header>
  );
};

export default ProfessorList;
/*{content === "" && (
            <Select
              onSelect={setFilteredByAxis}
              options={[
                ...new Map(
                  professorAxisValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}*/