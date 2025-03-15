import React, { useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { IAlumn } from "../../../types/alumn";
import IconButton from "../../atoms/IconButton";
import Input from "../../atoms/Input";
import CreateAlumnCard from "../../molecules/CreateAlumnCard";
import { ButtonsBox, FilterBox, Header } from "../styles";
import Select from "../../atoms/Select";
import { alumnStatusMap } from "../../../utils/maps/status";
import AlumnsTable from "../../../utils/table/alumnColumns";
import { IAxis } from "../../../types";

interface AlumnListProps {
  alumns: IAlumn[];
  add: boolean;
  refresh(): void
  setAlumns(alumns: IAlumn[]): void
}

const AlumnList: React.FC<AlumnListProps> = ({ alumns, add, refresh, setAlumns }) => {
  const [content, setContent] = useState<"add" | "">("");
  const [filteredAlumn, setFilteredAlumns] = useState<
    IAlumn[] | undefined
  >(alumns);

  let axisOnCourse: Set<IAxis> = new Set()
  alumns.map((alumn) => {
    const validAxis = alumn.axis?.filter((axis)=> axis.status == 'onCourse')
    if(validAxis?.length) validAxis.forEach(axis=> axisOnCourse.add(axis))
  })
  const alumnAxisOnCourseValues = [{ key: "", value: "Filtrar por turma" }].concat( axisOnCourse?.size ?
    [...axisOnCourse]?.map((axis) => {
        return  { key: axis?._id, value: axis?.type };
    })
  : { key: "notFound", value: "Sem turma" });
  
  
  const alumnStatusValues = [{ key: "", value: "Filtrar por status" }].concat(
    alumns.map((alumn) => {
      return { key: alumn.status, value: alumnStatusMap[alumn.status] };
    })
  );
  
  const setFilteredByStatus = (key: string) => {
    key !== "notChosen"
      ? setFilteredAlumns(
          alumns.filter((alumn) => {
            return alumn.status === key;
          })
        )
      : setFilteredAlumns(alumns);
  };
  const setFilteredByAxis = (key: string) => {
    if (key === "") {
      setFilteredAlumns(alumns);
      return;
    }
    if (key === "notFound") {
      setFilteredAlumns(
        alumns.filter((alumn) => {
          return !alumn.axis;
        })
      );
      return;
    }
    setFilteredAlumns(
      alumns.filter((alumn, i) => {
        return alumn.axis?.some(a => a._id === key)
      })
    );
  };

  return (
    <Header>
      <h5 style={{ fontSize: "20px", width: "100%" }}>
        Alunos encontrados: {filteredAlumn?.length}
      </h5>
      {add && content === "add" && (
        <IconButton
          name="addAlumn"
          icon={FaTimes}
          onPress={() => setContent("")}
        />
      )}
      <ButtonsBox>
        {content === "add" ? null : (
          <Input
            name="search"
            placeholder="Buscar pelo nome ou cpf"
            icon={FaSearch}
            onChange={(e) => {
              setFilteredAlumns(
                alumns?.filter((alumn) => {
                  return (alumn.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                    || alumn.cpf
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()));
                })
              );
            }}
          />
        )}

        <FilterBox>
          {content === "add" ? <CreateAlumnCard alumns={alumns} setAlumns={setAlumns} refresh={refresh} /> : null}
          
          {content === "" && (
            <Select
              onSelect={setFilteredByAxis}
              options={[
                ...new Map(
                  alumnAxisOnCourseValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}

          {content === "" && (
            <Select
              onSelect={setFilteredByStatus}
              options={[
                ...new Map(
                  alumnStatusValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
          
        </FilterBox>
        {add && content === "" && (
          <IconButton
            name="addAlumn"
            icon={FaPlus}
            onPress={() => setContent("add")}
          />
        )}
      </ButtonsBox>
      {content === "" && filteredAlumn && ( <AlumnsTable alumns={filteredAlumn}/>
        
      )}
    </Header>
  );
};

export default AlumnList;