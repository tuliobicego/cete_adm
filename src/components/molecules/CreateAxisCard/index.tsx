import React, { useState } from "react";
import { Container, DateContainer } from "./styles";
import { useMutation, useQuery } from "@apollo/client";
import {
  NewAxisInput,
  NewAxisPayload,
  CREATE_AXIS,
} from "../../../api/database/mutations/createAxis";
import Loading from "../../atoms/Loading";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import { IAlumn, IAxis } from "../../../types";
import { DatePicker, Table, Tag } from "antd";
import Disclaimer from '../../atoms/Disclaimer'
import MutationModal from "../../templates/MutationModal";
import { GET_PROFESSORS, ProfessorsPayload, ProfessorsInput } from "../../../api/database/queries/getProfessors";
import { axisStatusMap } from "../../../utils/maps/status";
import NoData from "../../atoms/NoData";
import { axisErrorMap } from "../../../utils/maps/error";
import { axisColorStatusMap } from "../../../utils/maps/color";
import dayjs, { Dayjs } from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { stringToDateRed } from "../../../utils/date/date";
import { axisTypeMap } from "../../../utils/maps/type";
import AxisCard from "../AxisCard";
import { useNavigate } from "react-router";

dayjs.locale("pt-br");

const { RangePicker } = DatePicker

const availableAlumnsColumns = [
  {
    title: "Aluno",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Turma Atual",
    dataIndex: "currentAxis",
    key: "currentAxis",

    filters: [{text: 'A', value: 'A'},{text: 'B', value: 'B'},{text: 'C', value: 'C'},{text: 'D', value: 'D'},{text: 'E', value: 'E'},{text: 'Nenhum', value: 'Nenhum'}],

    filterSearch: true,
    onFilter: (value, record) => record.currentAxis === value,
    width: '30%',
  },
  
]

interface CreateAxisCardProps {
  refresh(): void
  axiss: IAxis[] | undefined
  setAxiss(axiss: IAxis[]): void
}

const CreateAxisCard: React.FC<CreateAxisCardProps> = ({ refresh, axiss, setAxiss }) => {

  const alumnsOnCourse = axiss?.map((axis)=> {return axis.alumns?.filter(alumn=>(alumn.status == 'waiting' && alumn.type !== 'enrolled') || alumn.status == 'onCourse') || []}).flat().sort((a,b)=>a.name.localeCompare(b.name)).flat()
  const uniqueAlumns = alumnsOnCourse?.length ? Array.from(new Map(alumnsOnCourse?.map(obj => [obj?._id, obj])).values()) : [] as IAlumn[]
  
  const [dateStart, setDateStart] = useState<Dayjs | undefined>();
  const [dateEnd, setDateEnd] = useState<Dayjs | undefined>();
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [availableAlumns, setAvailableAlumns] = useState<IAlumn[]>([] as IAlumn[]);
  const [alumnsIds, setAlumnsIds] = useState<string[] | undefined>(undefined);
  const [professorId, setProfessorId] = useState<string | undefined>(undefined);
  
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<'emptyType' | 'emptyDate' | 'invalidDate' |'emptyProfessor' | 'emptyAlumns' | ''>('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  
  const [newAxis, setNewAxis] = useState<IAxis | undefined>();
  
  
  const [typeValues, setTypeValues] = useState<{ key: string; value: string }[]>([
    { key: "", value: "Escolha um tipo de turma" },
    { key: "A", value: "A" },
    { key: "B", value: "B" },
    { key: "C", value: "C" },
    { key: "D", value: "D" },
    { key: "E", value: "E" }
  ]);
  const [professorValues, setProfessorValues] = useState<{ key: string; value: string }[]>([{ key: "", value: "Escolha um professor cadastrado" }]);

  const navigate = useNavigate();

  const handleReload = () => {
    navigate(0); 
  };

  const { loading: loadingProfessors } = useQuery<ProfessorsPayload, ProfessorsInput>(GET_PROFESSORS, {
    variables: {status: 'leader'},
    onCompleted: (data) => {
      if (data.professors.professors) {
        setProfessorValues(
          professorValues.concat(
            data.professors.professors.map((professor) => {
              return { key: professor._id, value: professor.name };
            })
          )
        );
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });


  const [createAxis, { loading: loadingCreateAxis }] = useMutation<
    NewAxisPayload,
    NewAxisInput
  >(CREATE_AXIS, {
    onCompleted: (data) => {
      
      if(data.createAxis.axis) {
        setIsVisible({show: true, type: 'success'})
        setNewAxis(data.createAxis.axis)
      }
      else {
        setErrorDescription( axisErrorMap[data.createAxis.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( axisErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  
  const setAxisType = (key: string) => {

    setAvailableAlumns(uniqueAlumns.filter((alumn)=>!alumn.axis?.find((axis)=> axis.type === axisTypeMap[key] && axis.status === status)))
    setType(axisTypeMap[key])
  }  
  
  const changeDates = (dates: [Dayjs | null, Dayjs | null] | null, dateString: string | string[]) => {

    if(Array.isArray(dates) && dates.length === 2) {
      if(dates[0]) setDateStart(dates[0]) 
      if(dates[1]) setDateEnd(dates[1]) 
    
      const now = dayjs();
      if(dates[1]?.isBefore(now)) {
        setStatus('')
        setDisclaimer('invalidDate')
      }
      else if(dates[0]?.isBefore(now))  {
        setStatus("onCourse")
        setDisclaimer('')
      } else if(dates[0]?.isAfter(now)) {
        setStatus("scheduled")
        setDisclaimer('')
      } 
    }
    else {
      setStatus('')
    }
  }


  const handleSubmit = () => {
    if(!dateStart || !dateEnd) {
      setDisclaimer('invalidDate')
      return
    } else {
      setDisclaimer('')
    }
    if (type === '') {
      setDisclaimer('emptyType')
      return
    } else {
      setDisclaimer('')
    }
    if (professorId === '') {
      setDisclaimer('emptyProfessor')
      return
    } else {
      setDisclaimer('')
    }
    if (status === 'onCourse' && !alumnsIds?.length) {
      setDisclaimer('emptyAlumns')
      return
    } else {
      setDisclaimer('')
    }
    setDisclaimer('')
    console.log('hiiii')
    setIsVisible({show: true, type: 'confirmation'})
  }

  const onSelectAlumns = (selectedRow) => {
    setAlumnsIds(selectedRow);
  };


  const handleCreateAxis = () => {
    if(professorId && dateStart && dateEnd) {
      createAxis({
        variables: {
          axisInput: {
            type,
            dateStart: dateStart?.toDate().toISOString(),
            dateEnd: dateEnd?.toDate().toDateString(),
            professorId,
            alumnsIds

          },
        },
      })
    }
  }

  return (<>
    <Container>
      <h2 key="register"> Nova Turma </h2>
      {!loadingCreateAxis ? (
        <>
          <DateContainer>
          <h1 key="register"> Datas de início e fim: </h1>
          <RangePicker
            format={"DD-MM-YYYY"}
            key="dateStart"
            locale={ptBR}
            style={{ width: "60%" }}
            onChange={changeDates}
            placeholder={["Selecione a data de início", "Selecione a data de fim"]}
            allowClear={true}
            showTime={false}
          />
            <Tag
              color={status ? axisColorStatusMap[status] : 'transparent'}
              style={{
                width: "10%",
                textAlign: "center",
                borderRadius: ".5rem",
                fontSize: "16px",
              }}
              key={status}
            >
              {status ? axisStatusMap[status] :''}
            </Tag>
          </DateContainer>
          
          <h2 key="professorLabel" style={{ marginTop: "2%" }}> Professor responsável </h2>
          {loadingProfessors ? (
            <Loading />
          ) : (
            <>
              
              {professorValues ? (
                <Select
                  key="professors"
                  options={professorValues}
                  onSelect={setProfessorId}
                />
              ) : <NoData/>}
            </>
          )}
          
          <Select
            key="type"
            options={typeValues}
            onSelect={setAxisType}
          />
          
          {availableAlumns?.length && status ? <>
             <h2 key="alumnsLabel" style={{ marginTop: "2%" }}> Alunos habilitados </h2>
            <Table
              columns={availableAlumnsColumns}
              rowSelection={{ type: 'checkbox', onChange: onSelectAlumns }}
              dataSource={availableAlumns?.map((alumn) => {
                const alumnAxis = alumn.axis?.filter((axis)=>axis.status === 'onCourse')
                const alumnCurrentAxisType = alumn.status === "cancelled" || alumn.status === 'completed' ? 'Nenhum' : alumnAxis?.length ? alumnAxis.sort((a, b) => stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())[0]?.type : 'Nenhum'
                return {
                  key: (alumn._id).toString(),
                  name: alumn.name,
                  currentAxis: alumn.axis && alumn.axis.length ? alumnCurrentAxisType : "",
                  
                };
              })}
              pagination={{ pageSize: 200, position: ['none', 'none']}}
              style={{ width: "100%", height: "100%" }}
            /></>
          : type === "" || status === ""  ? null : <NoData/>}


          
          
          <Disclaimer disclaimer={disclaimer} />
              <Button
                key={`add_axis_mutation_button`}
                name={`add_axis_mutation_button`}
                onPress={handleSubmit}
                text="Cadastrar nova turma"
              />
            
        </>
      ) : (
        <Loading />
      )}
      
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
        dateStart && type && dateEnd && professorId  ? handleCreateAxis()
        : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        const newAxisList = axiss?.length ? [...axiss, newAxis] as IAxis[] : newAxis ? [newAxis] : null
        if(newAxisList) setAxiss(newAxisList)       
          handleReload() 
      }}
      content={{
        confirmationTopText: `Gostaria de criar uma nova turma?`,
        errorDescription,
        successDescription: 'Nova turma criada com sucesso!',
      }}
      loading={loadingCreateAxis}
      children={<AxisCard axis={{_id: 'newId',type, dateEnd: dateEnd?.toDate().toISOString() || "", dateStart: dateStart?.toDate().toISOString() || "", status }}/>}
    />
    </Container>
  </>
  );
};

export default CreateAxisCard;
