import React, {useState} from 'react'
import { Container, DateContainer, DateTimePickerBox } from './styles'
import Input from '../../atoms/Input'
import Loading from '../../atoms/Loading'
import Select from '../../atoms/Select'
import {  useMutation, useQuery } from '@apollo/client'
import { CREATE_LESSON, NewLessonInput, NewLessonPayload } from '../../../api/database/mutations/createLesson'
import { IAlumn, IAxis, ILesson, IProfessor } from '../../../types'
import Button from '../../atoms/Button'
import MutationModal from '../../templates/MutationModal'
import Disclaimer from '../../atoms/Disclaimer'
import { lessonStatusMap } from '../../../utils/maps/status'
import { lessonColorStatusMap, lessonPeriodColorMap } from '../../../utils/maps/color'
import { DatePicker, Radio, Tag } from 'antd'
import dayjs, { Dayjs } from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { dateToStringRed, revertDatePicker, stringToDateRed, transformDatePicker } from "../../../utils/date/date";
import { lessonPeriodMap } from '../../../utils/maps/date'
import { lessonErrorMap } from '../../../utils/maps/error'
import { GET_PROFESSORS, ProfessorsInput, ProfessorsPayload } from '../../../api/database/queries/getProfessors'
import LessonCard from '../LessonCard'
import { AxisPayload, GET_AXIS } from '../../../api/database/queries/getAxis'
import { isValid } from '../../../utils/verifiers/verifiers'
import { Table } from 'antd/lib'
import { useNavigate } from 'react-router'

interface CreateLessonCardProps {
  refresh(): void
  setLessons(lessons: ILesson[]): void
  lessons: ILesson[] | undefined
  setContent(): void
}

const CreateLessonCard: React.FC<CreateLessonCardProps> = ({refresh, lessons, setLessons, setContent }) => {

  //const axissOnCourse = lessons?.map((lesson)=> {return lesson.axis?.status === "scheduled" || lesson.axis?.status === "onCourse" ? lesson.axis : undefined}).filter(axis=>axis)
  //const uniqueAxiss = axissOnCourse?.length ? Array.from(new Map(axissOnCourse?.map(obj => [obj?._id, obj])).values()) : [] as IAxis[]


  const [period, setPeriod] = useState<string>('')
  

  const [location, setLocation] = useState<'presentialAndTele' | 'presential' | 'tele'>("presentialAndTele")
  const [locationValues, setLocationValues] = useState<{value: string, label: string}[]>([
    { value: 'presentialAndTele', label: "Presencial e remoto" },
    { value: 'presential', label: "Presencial"},
    { value: 'tele', label: "Remoto" }])
  const [name, setName] = useState<string>("")

  const [axisId, setAxisId] = useState<string>('')
  const [axissValues, setAxissValues] = useState<{key: string, value: string}[]>([{key: '', value: 'Escolha uma turma'}])
  const [availableAxiss, setAvailableAxiss] = useState<IAxis[] | undefined>(undefined);
  const [chosenAxis, setChosenAxis] = useState<IAxis | undefined>();
  const [minDate, setMinDate] = useState<Dayjs | undefined >();
  const [maxDate, setMaxDate] = useState<Dayjs | undefined >();
  
  
  const [date, setDate] = useState<Dayjs | undefined>(undefined);
  const [status, setStatus] = useState<string>("");
  const [newLesson, setNewLesson] = useState<ILesson | undefined>();
  const [alumnsIds, setAlumnsIds] = useState<string[] | undefined>(undefined);
  const [axisAlumns, setAxisAlumns] = useState<IAlumn[] | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  const [professorId, setProfessorId] = useState<string | undefined>(undefined);
  const [chosenProfessor, setChosenProfessor] = useState<IProfessor | undefined>();
  const [professors, setProfessors] = useState<IProfessor[] | undefined>();
  const [professorsValues, setProfessorsValues] = useState<{key: string, value: string}[]>([{key: '', value: 'Escolha um professor cadastrado'}])
  
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<'emptyPeriod' | 'emptyDate' | 'invalidDate' |'emptyProfessor' | 'emptyStatus' | 'emptyAxis' | '' >('')
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})

  const navigate = useNavigate();
  
  const handleReload = () => {
    navigate(0); 
  };

  const { loading: loadingAxiss } = useQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      const available = data.axiss.axiss.filter((axis): axis is IAxis => axis.status === 'onCourse' || axis.status === 'scheduled')
      if (available.length) {
        setAvailableAxiss(data.axiss.axiss);
        setAxissValues(
          axissValues.concat(
            available.map((axis)=>{
              return {key: axis?._id || "", value: axis?.type+" - Início "+axis?.dateStart}
            })
          )
        )
      }
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });
  
  const { loading: loadingProfessors } = useQuery<ProfessorsPayload, ProfessorsInput>(GET_PROFESSORS, {
    onCompleted: (data) => {
      if (data.professors.professors) {
        setProfessors(data.professors.professors)
        setProfessorsValues(
          professorsValues.concat(
            data.professors.professors.filter(professor=>professor.status!=='inactive').sort((a,b)=>a.name.localeCompare(b.name)).map((professor) => {
              console.log();
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

  const [createLesson, {loading: loadingCreateLesson}] = useMutation
    <NewLessonPayload, NewLessonInput>(
      CREATE_LESSON,
      {onCompleted: (data) => {
      
        if(data.createLesson.lesson) {
          setIsVisible({show: true, type: 'success'})
          setNewLesson(data.createLesson.lesson)
        }
        else {
          setErrorDescription( lessonErrorMap[data.createLesson.errors.message])
          setIsVisible({show: true, type: 'error'})}     
      },
      onError: (error) => {
        setErrorDescription( lessonErrorMap[''])
        setIsVisible({show: true, type: 'error'})
        console.log(JSON.stringify(error, null, 2));
      },
    });
    
  const changeDate = (date: Dayjs | null, dateString: string | string[]) => {
    if(date) {
      setDate(date);
      const now = dayjs();
      const noon = dayjs(date.format("YYYY-MM-DD") + "T12:00:00");
      if(date.isAfter(now)) {
        setStatus('scheduled')
      } else {
        setStatus('done')        
      }
      if(date.isBefore(noon)) {
        setPeriod('morning')
      } else {
        setPeriod('afternoon')
      }
    } else {
      setStatus('')
      setPeriod('')
    }
  };
  
const handleConfirmation = () => {
    if (axisId === '') {
      setDisclaimer('emptyAxis')
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
    if (!date) {
      setDisclaimer('emptyDate')
      return
    } else {
      setDisclaimer('')
    }
    if (period === '') {
      setDisclaimer('emptyPeriod')
      return
    } else {
      setDisclaimer('')
    }
    if (status === '') {
      setDisclaimer('emptyStatus')
      return
    } else {
      setDisclaimer('')
    }
    setIsVisible({show: true, type: 'confirmation'})
  }

const handleCreateLesson =  () =>  {
  
  if (professorId && axisId && date && location && name && period && status) { 
  createLesson(
    { variables:
      { lessonInput:
        { professorId, axisId, date: date.toDate().toISOString(), period, location, name, status, alumnsIds: status === 'done' ? alumnsIds : undefined }
      }
    })
  }
  else {
    setIsVisible({show: true, type: 'error'})

  }
}

const setAxis = (id: string) => {
  const axisFound = availableAxiss?.find((axis): axis is IAxis => axis._id === id)
  if(axisFound?.type === 'E') {
    setLocation('tele')
   setLocationValues([{ value: 'tele', label: "Remoto" }])
  } else {
    setLocationValues([
      { value: 'presentialAndTele', label: "Presencial e remoto" },
      { value: 'presential', label: "Presencial"},
      { value: 'tele', label: "Remoto" }])
  }
  setAxisId(id)
  setChosenAxis(axisFound)
  const min = revertDatePicker(availableAxiss?.find((axis): axis is IAxis=>axis._id.toString() === id.toString())?.dateStart, 'start')
  const max = revertDatePicker(availableAxiss?.find((axis): axis is IAxis=>axis._id.toString() === id.toString())?.dateEnd, 'end')
  setMinDate(min)
  setMaxDate(max)
  setAxisAlumns(axisFound?.alumns)

}

const rowSelection = {
  selectedRowKeys, // Controla as seleções
  onChange: (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys)
    const idsList = selectedKeys.map((key)=>key.toString())
    setAlumnsIds(idsList); // Atualiza as seleções
  },
};

const setProfessor = (id: string) => {
  setProfessorId(id)
  const professorFound = professors?.find((professor): professor is IProfessor => professor._id.toString() === id.toString())
  setChosenProfessor(professorFound)
}

  if(loadingProfessors || loadingAxiss)  return (
    <Container><Loading/></Container>
  )


  return (
    <>
    <Container>
      
      {availableAxiss && !loadingProfessors ?<>
        <h3>Cadastrar Aula</h3>
        
          
        <h1 style={{width:'100%', marginTop: "2%", marginBottom: "2%"}} key="nameLabel">Nome da aula</h1>
        <Input
          label=''
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value)
            if(e.currentTarget.value && isValid(e.currentTarget.value, 'name')) setDisclaimer('')
          }}
          name={'name'}
          placeholder={'ex: assunto da aula, tema'}
          autoComplete={'false'}
        />
        <h1 style={{width:'100%', marginBottom: "2%",  marginTop: "2%"}} key="professorLabel">Escolha o professor</h1>
        <Select options={[...new Map(professorsValues.map(item => [item['key'], item])).values()]} onSelect={setProfessor}/>

        <h1 style={{width:'100%', marginBottom: "2%",  marginTop: "2%"}} key="axisLabel">Escolha a turma</h1>
        <Select
          key="axis"
          options={axissValues}
          onSelect={setAxis}
        />
        {axisId ? (<>
          <DateContainer>
            <h1 style={{width:'100%'}}key="register"> Data e hora: </h1>
            <DateTimePickerBox>
              <DatePicker
                format={"DD-MM-YYYY HH:mm"}
                key={"date_picker"}
                showTime={true}
                locale={ptBR}
                style={{ width: "50%" }}
                onChange={changeDate}
                placeholder="Selecione a data"
                minDate={minDate}
                maxDate={maxDate}
              />
              <Tag
                color={period ? lessonPeriodColorMap[period] : 'transparent'}
                style={{
                  width: "15%",
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={period}
              >
                {period ? lessonPeriodMap[period] :''}
              </Tag>
              <Tag
                color={status ? lessonColorStatusMap[status] : 'transparent'}
                style={{
                  width: "15%",
                  textAlign: "center",
                  borderRadius: ".5rem",
                  fontSize: "16px",
                }}
                key={status}
              >
                {status ? lessonStatusMap[status] :''}
              </Tag>
            </DateTimePickerBox>
            <h1 style={{width:'100%', marginBottom: "2%",  marginTop: "2%"}} key="locationLabel">Modalidade</h1>
            <Radio.Group
              style={{ width: "100%", justifyContent: "flex-start"}}
              value={location}
              options={locationValues}
              onChange={(e) => {
                if(e.target.value === 'presentialAndTele' || e.target.value === 'presential' || e.target.value === 'tele') setLocation(e.target.value)
                }}
            />
          </DateContainer>
          
        </>) : null}

                  
      {status === 'done' ? <>
        <h2 style={{ marginBottom: "2%",  marginTop: "2%"}}  key="register"> Chamada </h2>
        <Table
          columns={[
              {
                title: "Aluno",
                dataIndex: "name",
                key: "name",
              },
              
            ]}
          rowSelection={rowSelection}
          //rowSelection={{ type: 'checkbox', onChange: onSelectCall }}
          dataSource={axisAlumns?.map((alumn) => {
            return {
              key: (alumn._id).toString(),
              name: alumn.name,
            };
          })}
          pagination={{ pageSize: 200, position: ['none', 'none']}}
          style={{ width: "100%", height: "100%" }}
        />
        
        </> : null}
        

        <Disclaimer disclaimer={disclaimer}/>
        <Button name={`add_lesson_button`} key={`add_lesson_button`} 
        onPress={() => handleConfirmation()}
        text='Criar aula'
        />
        
    </> : <Loading/>}
    
    <MutationModal
      key={'createLessonMutationModal'}
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}

      onPressMutate={() => {
        professorId && date && location && name && period ? handleCreateLesson()
        : setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        const newLessonsList = lessons?.length ? [...lessons, newLesson] as ILesson[] : newLesson ? [newLesson] : null
        if(newLessonsList) setLessons(newLessonsList)        
        setContent()
        handleReload()
      }}
      content={{
        confirmationTopText: `Gostaria de criar uma nova aula?`,
        errorDescription,
        successDescription: 'Nova aula criada com sucesso!',
      }}
      loading={loadingCreateLesson}
      children={<LessonCard lesson={{_id: 'newId', date: dateToStringRed(date?.toDate()) , status, name, period, professor: chosenProfessor, axis: chosenAxis}}/>}
    />
    </Container>
    </>
  )
}

export default CreateLessonCard