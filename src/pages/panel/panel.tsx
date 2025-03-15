import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { FaChalkboardTeacher, FaClipboardCheck, FaFileImport, FaSearch, FaUsers } from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import Body from "../../components/templates/Body";
import { Badge, Calendar, Tabs } from "antd";
import Loading from "../../components/atoms/Loading";
import NoData from "../../components/atoms/NoData";
import ErrorModal from "../../components/templates/ErrorModal";
import IconButton from "../../components/atoms/IconButton";
import { HorizontalContainer, Container, EnrolledHeader, EnrolledButtonsBox, CalendarContainer, WarningContainer, WarningContent } from "../styles";
import Input from "../../components/atoms/Input";
import { AlumnsInput, GET_ALUMNS, AlumnsPayload} from "../../api/database/queries/getAlumns";
import { IAlumn, IAxis, ILesson } from "../../types";
import EnrolledsTable from "../../utils/table/enrolledColumns";
import MutationModal from "../../components/templates/MutationModal";
import { alumnErrorMap } from "../../utils/maps/error";
import { UpdateAlumnPayload, UPDATE_ALUMN, UpdateAlumnInput } from "../../api/database/mutations/updateAlumn";
import { Dayjs } from "dayjs";
import { AxisPayload, GET_AXIS } from "../../api/database/queries/getAxis";
import { GET_LESSONS, LessonsPayload } from "../../api/database/queries/getLessons";
import { dateToStringRed, revertDatePicker, stringToDate, transformDatePicker, revertFullDatePicker } from "../../utils/date/date";
import BasicModal from "../../components/templates/BasicModal";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import LessonCard from "../../components/molecules/LessonCard";
import AxisCard from "../../components/molecules/AxisCard";
import AlumnCard from "../../components/molecules/AlumnCard";
import { useNavigate } from "react-router";
import { CREATE_ENROLLED, NewEnrolled, NewEnrolledPayload, NewEnrollmentInput } from "../../api/database/mutations/createEnrolled";

interface TabsProps {
  name: string
  icon: any
  children?: any
}

const Panel: React.FC = () => {


  const [enrolled, setEnrolled] = useState<IAlumn[] | undefined>();
  const [filteredEnrolled, setFilteredEnrolled] = useState<IAlumn[] | undefined>();
  const [ archiveEnrollment, setArchiveEnrollment] = useState<IAlumn | undefined>()

  const [inadimplent, setInadimplent] = useState<IAlumn[] | undefined>();
  const [noGrade, setNoGrade] = useState<IAlumn[] | undefined>();

  
  const [axiss, setAxiss] = useState<IAxis[] | undefined>();
  const [axissFound, setAxissFound] = useState<IAxis[] | undefined>();
  
  const [lessons, setLessons] = useState<ILesson[] | undefined>();
  const [lessonsFound, setLessonsFound] = useState<ILesson[] | undefined>();

  const [showError, setShowError] = useState<boolean>(false);
  const [reloading, setReloading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [confirmationTopText, setConfirmationTopText] = useState<string>('')
  const [successDescription, setSuccessDescription] = useState<string>('')

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);


  const [content, setContent] = useState<'archive' | 'create' | ''>('');

  
  const [jsonData, setJsonData] = useState<{enrolled: NewEnrolled[]} | undefined>(undefined);

  const navigate = useNavigate();
  
  const handleReload = () => {
    navigate(0); 
  };

  const { loading: loadingEnrolled, refetch: refetchEnrolled } = useQuery<AlumnsPayload, AlumnsInput>(GET_ALUMNS, {
    variables: {type: 'enrolled'},
    onCompleted: (data) => { 
      const enrolledFound = data.alumns.alumns.filter(alumn=>alumn.type === 'enrolled')
      const inadimplentFound =   data.alumns.alumns.filter(alumn=>alumn.type !== 'enrolled')  
      const noGradeFound = data.alumns.alumns.filter(alumn=>alumn.type !== 'enrolled')  
      if (enrolledFound) {
        setFilteredEnrolled(enrolledFound)
        setEnrolled(enrolledFound);
      }  
      if (inadimplentFound) {
        setInadimplent(inadimplentFound)
      } 
      if(noGradeFound) {
        setNoGrade(noGradeFound)

      }
    },
    onError: (error) => {
      setShowError(true)
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const { refetch: refetchAxiss } = useQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      const activeAxiss = data.axiss.axiss.filter((axis): axis is IAxis => axis.status !== 'cancelled')
      if (activeAxiss.length) setAxiss(activeAxiss);
    },
    onError: (error) => {
      setShowError(true)
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });

  const { refetch: refetchLessons } = useQuery<LessonsPayload>(GET_LESSONS, {
    onCompleted: (data) => {
      const activeLessons = data.lessons.lessons.filter((lesson): lesson is ILesson => lesson.status === 'confirmed' || lesson.status === 'scheduled' || lesson.status === 'done')
      if (activeLessons) setLessons(activeLessons);
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "cache-and-network",
  });

  const handleRefetch = async () => {
    setReloading(true);
    try {
      setShowError(false)
      await refetchEnrolled(); 
      await refetchAxiss()
      await refetchLessons()
    } catch (error) {
      setShowError(true)
      console.error("Erro ao atualizar:", error);
    } finally {
      setReloading(false);
    }
  };



  const [archiveAlumn, { loading: loadingArchiveEnrollment }] = useMutation<
  UpdateAlumnPayload,
    UpdateAlumnInput
  >(UPDATE_ALUMN, {
    onCompleted: (data) => {
      
      if(data.updateAlumn.alumn) {
        setIsVisible({show: true, type: 'success'})
      }
      else {
        setErrorDescription( alumnErrorMap[data.updateAlumn.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( alumnErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const [createEnrolled, { loading: loadingCreateEnrolled }] = useMutation<
    NewEnrolledPayload,
    NewEnrollmentInput
  >(CREATE_ENROLLED, {
    onCompleted: (data) => {
      
      if(data.createEnrolled.alumns.length) {
        setIsVisible({show: true, type: 'success'})
      }
      else {
        setErrorDescription( alumnErrorMap[data.createEnrolled.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( alumnErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });


  const setArchiveEnrollmentAux = (enrollment: IAlumn) => {
    setSuccessDescription(`Inscrição de ${enrollment?.name} arquivada com sucesso!`)
    setConfirmationTopText(`Gostaria de arquivar a inscrição de ${enrollment?.name}?`)
    setArchiveEnrollment(enrollment)
    setIsVisible({show: true, type: 'confirmation'})
  }

  const handleArchiveAlumn = () => {
    if(archiveEnrollment) {
      archiveAlumn({
        variables: {
          alumnInput: {
            alumnId: archiveEnrollment?._id,
            status: 'paused'
          },
        },
      });
    }
  }

  const onSelectDate = (value: Dayjs, {source}) => {
    if (source === "date") {
      const lessonsFound = lessons?.filter((lesson): lesson is ILesson => dateToStringRed(stringToDate(lesson.date)) === transformDatePicker(value));
      const axissFound = axiss?.filter((axis): axis is IAxis => {
        const i = revertDatePicker(axis.dateStart, 'start')
        const f = revertDatePicker(axis.dateEnd, 'end') 
        if(i && f) return i < value && f > value
        return false
      })
      if (lessonsFound || axissFound) {
        const formattedDate = value.format("DD-MM-YYYY");
        setSelectedDate(formattedDate);
        setVisible(true);
        setAxissFound(axissFound)
        setLessonsFound(lessonsFound)
      }
    }
  };
  const dateCellRender = (value: Dayjs, info) => {
    if (info.type === "date") {
    
      const lessonsFound = lessons?.filter((lesson): lesson is ILesson => dateToStringRed(stringToDate(lesson.date)) === transformDatePicker(value));
      const axissFoundStart = axiss?.filter((axis): axis is IAxis => axis.dateStart === transformDatePicker(value) )
      const axissFoundEnd = axiss?.filter((axis): axis is IAxis => axis.dateEnd === transformDatePicker(value))
      
      return  (
        <div>
          {lessonsFound?.length? lessonsFound.map((lesson, index) => (
            <Badge key={index} status={ lesson.status === 'done' ? "success" : lesson.status === 'confirmed' ? 'processing' : 'warning'} text={lesson.name} />
          )) : null}
          {axissFoundStart?.length? axissFoundStart.map((axis, index) => (
            <Badge key={index} status={ axis.status === 'finished' ? "success" : axis.status === 'onCourse' ? 'processing' : 'warning'} text={'Início da turma '+axis.type+' - '+axis.professor?.name} />
          )) : null}
          {axissFoundEnd?.length? axissFoundEnd.map((axis, index) => (
            <Badge key={index} status={ axis.status === 'finished' ? "success" : axis.status === 'onCourse' ? 'processing' : 'warning'} text={'Fim da turma '+axis.type+' - '+axis.professor?.name} />
          )) : null}
                  
        </div>
      );
    } else if(info.type === "month") {
      const lessonsFound = lessons?.filter((lesson): lesson is ILesson => revertFullDatePicker(lesson.date)?.month() === value.month() && revertFullDatePicker(lesson.date)?.year() === value.year() );
      const axissFoundStart = axiss?.filter((axis): axis is IAxis => revertDatePicker(axis.dateStart, 'start')?.month() === value.month() && revertDatePicker(axis.dateStart, 'start')?.year() === value.year() )
      const axissFoundEnd = axiss?.filter((axis): axis is IAxis => revertDatePicker(axis.dateEnd, 'end')?.month() === value.month() && revertDatePicker(axis.dateEnd, 'end')?.year() === value.year() )
      
      return  (
        <div>
          {lessonsFound?.length? lessonsFound.map((lesson, index) => (
            <Badge key={index} status={ lesson.status === 'done' ? "success" : lesson.status === 'confirmed' ? 'processing' : 'warning'} text={lesson.name} />
          )) : null}
          {axissFoundStart?.length? axissFoundStart.map((axis, index) => (
            <Badge key={index} status={ axis.status === 'finished' ? "success" : axis.status === 'onCourse' ? 'processing' : 'warning'} text={'Início da turma '+axis.type+' - '+axis.professor?.name} />
          )) : null}
          {axissFoundEnd?.length? axissFoundEnd.map((axis, index) => (
            <Badge key={index} status={ axis.status === 'finished' ? "success" : axis.status === 'onCourse' ? 'processing' : 'warning'} text={'Fim da turma '+axis.type+' - '+axis.professor?.name} />
          )) : null}
                  
        </div>
      );
    }
  };
  


  const tabs: TabsProps[] = [
    {
      name: 'Alunos Inadimplentes',
      icon: <FaUsers/>,
      children: <>
        {inadimplent?.length ? <WarningContent>
          
        {inadimplent.map((alumn)=> <AlumnCard alumn={alumn} profile={true}/>)}
        <IconButton name={'Alunos'} onPress={()=>null} icon={FaUsers}/>
        </WarningContent> : <NoData/>}
      </>
    },
    /*{
      name: 'Alunos sem nota',
      icon: <FaUsers/>,
      children: <>
        {noGrade?.length ? <WarningContent>
          
        {noGrade.map((alumn)=> <AlumnCard alumn={alumn} profile={true}/>)}
        <IconButton name={'Alunos'} onPress={()=>null} icon={FaAward}/>
        </WarningContent> : <NoData/>}
      </>
    },*/
    {
      name: 'Turmas em curso',
      icon: <FaPeopleLine/>,
      children:<>
      {axiss?.length ? <WarningContent>
        
      {axiss.filter((axis): axis is IAxis => axis.status === 'onCourse' || axis.status === 'scheduled').map((axis)=> <AxisCard axis={axis} details={true}/>)}
      <IconButton name={'Turmas'} onPress={()=>null} icon={FaPeopleLine}/>
      </WarningContent> : <NoData/>}
    </>
       
    },
    {
      name: 'Aulas marcadas',
      icon: <FaChalkboardTeacher/>,
      children:<>
      {lessons?.length ? <WarningContent>
        
      {lessons.filter((lesson): lesson is ILesson => lesson.status === 'confirmed' || lesson.status === 'scheduled').map((lesson)=> <LessonCard lesson={lesson} details={true}/>)}
      <IconButton name={'Aulas'} onPress={()=>null} icon={FaChalkboardTeacher}/>
      </WarningContent> : <NoData/>}
    </>
    },
    {
      name: 'Aulas sem chamada',
      icon: <FaClipboardCheck/>,
      children:<>
      {lessons?.length ? <WarningContent>
        
      {lessons.filter((lesson): lesson is ILesson => lesson.status === 'done' && !lesson.alumns?.length ).map((lesson)=> <LessonCard lesson={lesson} details={true}/>)}
      <IconButton name={'Aulas'} onPress={()=>null} icon={FaClipboardCheck}/>
      </WarningContent> : <NoData/>}
    </>
    },
    /*{
      name: 'Pagamentos',
      icon: <FaMoneyBillWave/>,
      children: 
        <IconButton name={'Pagamentos'} onPress={()=>null} icon={FaMoneyBillWave}/>
    },*/
  ]

  const handleCreateEnrollment = () => {
    
    
    if(jsonData && jsonData.enrolled ) createEnrolled({variables: { enrolledInput: jsonData.enrolled }})
    
  }
  const handleCreateEnrollmentButton = () => {
    
    
    setSuccessDescription(`Inscrição inseridas com sucesso!`)
    setConfirmationTopText(`Gostaria de inserir novas inscrições?`)
    
    setIsVisible({show: true, type: 'confirmation'})
    
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setJsonData(json);
        } catch (error) {
          console.error("Erro ao ler JSON:", JSON.stringify(error, null, 2));
        }
      };
      reader.readAsText(file);
    }
  };

  


  if ((loadingEnrolled || reloading)&& !enrolled)
    return (
      <Container>
        <Loading />
      </Container>
    );
    else if((!loadingEnrolled || !reloading) && !enrolled  && showError)
      return (
        <Container>
          <ErrorModal onPressClose={()=>setShowError(false)} onPressError={()=>setShowError(false)} onPressTryAgain={undefined} show={showError} loading={loadingEnrolled} content={{errorDescription:"Não foi possível buscar os alunos."}}/>
        </Container>
    )
    else if ((!loadingEnrolled || !reloading)  && !enrolled  && !showError  )
    return (
      <Container>
        <NoData />
      </Container>
    )
  
  return (
    <HorizontalContainer>
    <Body>
      {enrolled ? 
      <EnrolledHeader>
        <h5 style={{ fontSize: "20px", width: "100%" }}>
          Inscrições encontradas: {filteredEnrolled?.length}
        </h5>
        <EnrolledButtonsBox>
            
            <Input
              name="search"
              placeholder="Buscar pelo nome ou cpf"
              icon={FaSearch}
              onChange={(e) => {
                setFilteredEnrolled(
                  enrolled?.filter((enrolled) => {
                    return enrolled.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase());
                  }) || 
                  enrolled?.filter((enrolled) => {
                    return enrolled.cpf
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase());
                  })
                );
              }}
            />
            {/*<IconButton
              name={"Inserir inscrições"}
              label={"Inserir inscrições"}
              onPress={() => {}}
              icon={FaListCheck}
            />*/}
        </EnrolledButtonsBox>
        {filteredEnrolled?.length ? <EnrolledsTable enrolleds={filteredEnrolled} deleteAction={setArchiveEnrollmentAux} /> : <NoData/>}
        <Input
          label='Inserir inscrições'
          type="file" accept=".json"
          onChange={handleFileChange}
          sendButton={true}
          iconSendButton={FaFileImport}
          onSendButton={handleCreateEnrollmentButton}
        />

      </EnrolledHeader>
      : <NoData/>}

      </Body>
        
      <Body>

          <WarningContainer>
          <h5 style={{ fontSize: "20px", width: "100%" }}>
            Avisos!
          </h5>

          <Tabs
            defaultActiveKey="1"
            items={tabs.map((tab, i) => {
              return {
                key: tab.name,
                label: tab.name,
                children: tab.children,
                icon: tab.icon,
              };
            })}
            style={{display: 'flex', height: '100%', width: '100%', overflow: 'scroll'}}
          />
          </WarningContainer>
        
        <CalendarContainer>
          <Calendar 
            cellRender={dateCellRender}
            onSelect={onSelectDate} 
            locale={ptBR}
          />
          {visible ? <BasicModal text={`Data: ${selectedDate}`} onCancel={()=>setVisible(false)} visible={visible}
                      children={
                        <>
                          {lessonsFound?.length ? <>
                            <h5 style={{ fontSize: "20px", width: "100%" }}> Aulas </h5> 
                            {lessonsFound.map((lesson) => {return(<LessonCard lesson={lesson} details={true}/>)})}
                          </> : null}
                        {axissFound?.length ? <>
                              <h5 style={{ fontSize: "20px", width: "100%" }}> Turmas </h5> 
                              {axissFound.map((axis) => {return ( <AxisCard axis={axis} professor={true} details={true}/>)})}
                        </> : null}
                      </>}
          /> : null}
        </CalendarContainer>

      </Body>
    <MutationModal
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}
      onPressMutate={() => {
          if(content === 'archive') handleArchiveAlumn()
          else if(content === 'create') handleCreateEnrollment()
          else setIsVisible({show: true, type: 'error'})
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'success'})
        const newEnrolledList = enrolled?.filter((enr): enr is IAlumn => enr._id !== archiveEnrollment?._id) as IAlumn[] 
        if(newEnrolledList) setEnrolled(newEnrolledList)  
          handleReload()      
      }}
      content={{
        confirmationTopText,
        errorDescription,
        successDescription,
      }}
      loading={loadingArchiveEnrollment || loadingCreateEnrolled}
      
    />
  </HorizontalContainer>
  )
};

export default Panel;
