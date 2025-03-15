import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { IAxis } from "../../../types";
import IconButton from "../../atoms/IconButton";
import CreateAxisCard from "../../molecules/CreateAxisCard";
import { ButtonsBox, FilterBox, Header } from "../styles";
import Select from "../../atoms/Select";
import { axisStatusMap } from "../../../utils/maps/status";
import { Table, Tag, Space, Tooltip, DatePicker } from "antd";
import { useNavigate } from "react-router";
import { axisColorStatusMap, axisTypeColorMap } from "../../../utils/maps/color";
import { axisTypeMap } from "../../../utils/maps/type";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";
import dayjs, { Dayjs } from "dayjs";
import { revertDatePicker } from "../../../utils/date/date";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português

dayjs.locale("pt-br");

const { RangePicker } = DatePicker

const columns = [
  {
    title: "Tipo",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <Tag
        color={axisTypeColorMap[type]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={type}
      >
        {type}
      </Tag>
    ),
  },
  {
    title: "Responsável",
    dataIndex: "professorName",
    key: "professorName",
  },
  {
    title: "Data de início",
    dataIndex: "dateStart",
    key: "dateStart",
  },
  {
    title: "Data do fim",
    dataIndex: "dateEnd",
    key: "dateEnd",
  },
  {
    title: "Qtd alunos",
    dataIndex: "totalAlumns",
    key: "totalAlumns",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={axisColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {axisStatusMap[status]}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ getAxis }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Perfil">
          <IconButton name="details" onPress={getAxis} icon={ArrowRight} />
        </Tooltip>
      </Space>
    ),
  },
];

interface AxisListProps {
  axis: IAxis[];
  add: boolean;
  refresh(): void
  setAxiss(axiss: IAxis[]): void
}

const AxisList: React.FC<AxisListProps> = ({ axis, add, refresh, setAxiss }) => {
  const [content, setContent] = useState<"add" | "">("");
  const [filteredAxis, setFilteredAxiss] = useState<
    IAxis[] | undefined
  >(axis);
  const navigate = useNavigate();
  const axisAxisValues = [{ key: "", value: "Filtrar por responsável" }].concat(
    axis.map((axisu, i) => {
      if (axisu.professor) {
        return { key: axisu.professor._id, value: axisu.professor.name};
      }
      return { key: "notFound", value: "Professores não encontrados" };
    })
  );
  
  const axisStatusValues = [{ key: "", value: "Filtrar por status" }].concat(
    axis.map((axis) => {
      return { key: axis.status, value: axisStatusMap[axis.status] };
    })
  );
  const axisTypeValues = [{ key: "", value: "Filtrar por tipo" }].concat(
    axis.map((axis) => {
      return { key: axis.type, value: axisTypeMap[axis.type] };
    })
  );

  
  const changeDate = (date: Dayjs | null, dateString: string | string[]) => {

    if(date) {    
      setFilteredAxiss(
          axis.filter((axis) => {
            const dateStart = revertDatePicker(axis.dateStart, "start")
            const dateEnd = revertDatePicker(axis.dateEnd, "end")
            return date.isAfter(dateStart)&&date.isBefore(dateEnd)
          })
        )
    } else setFilteredAxiss(axis);
  }
  
  const setFilteredByStatus = (key: string) => {
    key !== ""
      ? setFilteredAxiss(
          axis.filter((axis) => {
            return axis.status === key;
          })
        )
      : setFilteredAxiss(axis);
  };
  const setFilteredByType = (key: string) => {
    key !== ""
      ? setFilteredAxiss(
          axis.filter((axis) => {
            return axis.type === key;
          })
        )
      : setFilteredAxiss(axis);
  };
  const setFilteredByProfessor = (key: string) => {
    if (key === "") {
      setFilteredAxiss(axis);
      return;
    }
    if (key === "notFound") {
      setFilteredAxiss(
        axis.filter((axis) => {
          return !axis.professor;
        })
      );
      return;
    }
    setFilteredAxiss(
      axis.filter((axis, i) => {
        return axis.professor?._id === key;
      })
    );
  };

  return (
    <Header>
      <h5 style={{ fontSize: "20px", width: "100%" }}>
      Turmas encontradas: {filteredAxis?.length}
      </h5>
      {add && content === "add" && (
        <IconButton
          name="addAxis"
          icon={FaTimes}
          onPress={() => setContent("")}
        />
      )}
      <ButtonsBox>
        {content === "add" ? null : (
          
          
          <DatePicker
          format={"DD-MM-YYYY"}
          key={"date_picker"}
          showTime={false}
          locale={ptBR}
          style={{ width: "50%" }}
          onChange={changeDate}
          placeholder="Selecione a data"
        />
        )}

        <FilterBox>
          {content === "add" ? <CreateAxisCard refresh={refresh}  axiss={axis} setAxiss={setAxiss}/> : null}
          
          {content === "" && (
            <Select
              onSelect={setFilteredByProfessor}
              options={[
                ...new Map(
                  axisAxisValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}

          {content === "" && (
            <Select
              onSelect={setFilteredByStatus}
              options={[
                ...new Map(
                  axisStatusValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
          

          {content === "" && (
            <Select
              onSelect={setFilteredByType}
              options={[
                ...new Map(
                  axisTypeValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
          
        </FilterBox>
        {add && content === "" && (
          <IconButton
            name="addAxis"
            icon={FaPlus}
            onPress={() => setContent("add")}
          />
        )}
      </ButtonsBox>
      {content === "" && filteredAxis && (
        <Table
          columns={columns}
          dataSource={filteredAxis?.map((axis, index) => {
            return {
              key: (index + 1).toString(),
              type: axis.type,
              dateStart: axis.dateStart,
              dateEnd: axis.dateEnd,
              totalAlumns: axis.alumns?.length,
              status: axis.status,
              professorName: axis.professor?.name,
              getAxis: () => {
                navigate( "/axisDetails", { state: {axisId: axis._id} });
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

export default AxisList;
