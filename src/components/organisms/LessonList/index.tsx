import React, { useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { ILesson } from "../../../types";
import IconButton from "../../atoms/IconButton";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import CreateLessonCard from "../../molecules/CreateLessonCard";
import { ButtonsBox, FilterBox, Header } from "../styles";
import { Table, Tag, Space, Tooltip, DatePicker } from "antd";
import { lessonStatusMap } from "../../../utils/maps/status";
import { useNavigate } from "react-router-dom";
import { lessonPeriodMap } from "../../../utils/maps/date";
import { lessonColorStatusMap, lessonPeriodColorMap } from "../../../utils/maps/color";
import { ReactComponent as ArrowRight } from "../../../assets/svg/chevron-right.svg";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import dayjs, { Dayjs } from "dayjs";
import { revertDatePicker } from "../../../utils/date/date";

dayjs.locale("pt-br");

const { RangePicker } = DatePicker

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
  }, 
  {
    title: "Professor",
    dataIndex: "professor",
    key: "professor",
  },
  { 
    title: "Alunos",
    dataIndex: "alumns",
    key: "alumns",
  },
  {
    title: "Data",
    dataIndex: "date",
    key: "date",
  }, 
  {
    title: "Período",
    dataIndex: "period",
    key: "period",
    render: (period) => (
      <Tag
        color={period ? lessonPeriodColorMap[period] : 'transparent'}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={period}
      >
        {period ? lessonPeriodMap[period] :''}
      </Tag>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={lessonColorStatusMap[status]}
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: ".5rem",
          fontSize: "16px",
        }}
        key={status}
      >
        {lessonStatusMap[status].toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "",
    dataIndex: "",
    key: "",
    render: ({ getLesson }) => (
      <Space size="middle">
        <Tooltip placement="bottom" title="Detalhes">
          <IconButton name="details" onPress={getLesson} icon={ArrowRight} />
        </Tooltip>
      </Space>
    ),
  },
];

interface LessonListProps {
  lessons: ILesson[];
  filterByStatus: boolean;
  add: boolean;
  filterByDate: boolean;
  filterByName: boolean;
  filterByProfessor: boolean;
  setLessons(lessons: ILesson[]): void
  refresh(): void
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  filterByDate,
  add,
  filterByStatus,
  filterByName,
  filterByProfessor,
  setLessons,
  refresh
}) => {
  
  const [content, setContent] = useState<"add" | "">("");
  const [filteredLesson, setFilteredLessons] = useState<
    ILesson[] | undefined
  >(lessons);
  const history = useNavigate();

  const professorsValues = [
    { key: "", value: "Filtrar por professor" },
  ].concat(
    lessons.map((lesson) => {
      if (lesson.professor) {
        return { key: lesson.professor._id, value: lesson.professor.name };
      }
      return { key: "notFound", value: "Sem professor" };
    }).sort((a,b)=> a.value.localeCompare(b.value))
  );
  const changeDates = (dates: [Dayjs | null, Dayjs | null] | null, dateString: string | string[]) => {
  if(Array.isArray(dates) && dates.length === 2) {    
    setFilteredLessons(
          lessons?.filter((lesson) => {
            const date = revertDatePicker(lesson.date, "start")
            return date?.isAfter(dates[0]) && date.isBefore(dates[1])
          })
        )
    } else setFilteredLessons(lessons);
  };

  const setFilteredProfessors = (key: string) => {
    key !== ""
      ? setFilteredLessons(
          lessons?.filter((lesson) => {
            return lesson.professor?._id === key;
          })
        )
      : setFilteredLessons(lessons);
  };
  const statusValues = [
    { key: "", value: "Todas Aulas" },
    { key: "done", value: "Encerrada" },
    { key: "confirmed", value: "Confirmada" },
    { key: "scheduled", value: "Agendada" },
    { key: "cancelled", value: "Cancelada" }
  ];
  const setFilteredStatus = (
    key: "" | "done" | "cancelled" | "scheduled"
  ) => {
    key !== ""
      ? setFilteredLessons(
          lessons?.filter((lesson) => {
            return lesson.status === key;
          })
        )
      : setFilteredLessons(lessons);
  };
  return (
    <Header>
      {content === "" && (
        <h3 style={{ fontSize: "20px", width: "100%" }}>
          Aulas encontradas: {filteredLesson?.length}
        </h3>
      )}
      {add && content === "add" && (
        <IconButton
          name="addLesson"
          icon={FaTimes}
          onPress={() => setContent("")}
        />
      )}
      <ButtonsBox>
        {content === "" && filterByName && (
          <><Input
            name="search"
            placeholder={"Buscar por nome"}
            icon={FaSearch}
            onChange={(e) => {
              setFilteredLessons(
                lessons?.filter((lesson) => {
                  return lesson.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase());
                })
              );
            }}
          /></>
        )}
        
        <FilterBox>
          {content === "add" && <CreateLessonCard lessons={lessons} setLessons={setLessons} refresh={refresh} setContent={()=>setContent('')}/> }
          {content === "" && filterByDate && (
            <RangePicker
              format={"DD-MM-YYYY"}
              key="dateStart"
              locale={ptBR}
              style={{ width: "100%", height: '80%'}}
              onChange={changeDates}
              placeholder={["Filtro", " por intervalo"]}
              allowClear={true}
              showTime={false}
            />
          )}
          
        

          {content === "" && filterByStatus && (
            <Select onSelect={setFilteredStatus} options={statusValues} />
          )}
          {content === "" && filterByProfessor && (
            <Select
              onSelect={setFilteredProfessors}
              options={[
                ...new Map(
                  professorsValues.map((item) => [item["key"], item])
                ).values(),
              ]}
            />
          )}
        </FilterBox>
        {add && content === "" && (
          <IconButton
            name="addLesson"
            icon={FaPlus}
            onPress={() => setContent("add")}
          />
        )}
      </ButtonsBox>

      {content === "" && filteredLesson && (
        <Table
          columns={columns}
          dataSource={filteredLesson?.map((lesson, index) => {
            return {
              key: (index + 1).toString(),
              name: lesson.name,
              date: lesson.date,
              period: lesson.period,
              professor: lesson.professor?.name,
              alumns: lesson.alumns?.length,
              status: lesson.status,
              getLesson: () => {
                history("/lessonDetails", {state: { lessonId: lesson._id }});
              },
            };
          })}
          pagination={{ pageSize: 200 }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Header>
  );
};

export default LessonList;
