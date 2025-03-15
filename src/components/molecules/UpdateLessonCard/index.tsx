import React, { useState } from "react";
import { Container, DateContainer, DateTimePickerBox, Label } from "./styles";
import Input from "../../atoms/Input";
import { useMutation, useQuery } from "@apollo/client";
import {
  UpdateLessonInput,
  UpdateLessonPayload,
  UPDATE_LESSON,
} from "../../../api/database/mutations/updateLesson";
import Loading from "../../atoms/Loading";
import Select from "../../atoms/Select";
import { DatePicker, Radio, Tag } from "antd";
import {
  revertDatePicker,
  revertFullDatePicker, transformFullDatePicker,
} from "../../../utils/date/date";
import Button from "../../atoms/Button";
import { IAxis, ILesson, IProfessor } from "../../../types";
import dayjs, { Dayjs } from "dayjs";
import ptBR from "antd/es/date-picker/locale/pt_BR"; // 🔹 Importa Locale Padrão para Português
import "dayjs/locale/pt-br"; // 🔹 Importa suporte para português
import { lessonColorStatusMap, lessonPeriodColorMap } from "../../../utils/maps/color";
import { lessonPeriodMap } from "../../../utils/maps/date";
import { lessonStatusMap } from "../../../utils/maps/status";
import { GET_PROFESSORS, ProfessorsInput, ProfessorsPayload } from "../../../api/database/queries/getProfessors";
import { AxisPayload, GET_AXIS } from "../../../api/database/queries/getAxis";
import { lessonErrorMap } from "../../../utils/maps/error";
import MutationModal from "../../templates/MutationModal";
import LessonCard from "../LessonCard";
import Disclaimer from "../../atoms/Disclaimer";

interface UpdateLessonCardProps {
  lesson: ILesson;
  setLesson(lessons: ILesson): void
  refetchLesson: ()=>Promise<void>
}

const UpdateLessonCard: React.FC<UpdateLessonCardProps> = ({ lesson, setLesson, refetchLesson}) => {
  const [date, setDate] = useState<Dayjs | undefined>(revertFullDatePicker(lesson.date));
  const [name, setName] = useState<string>(lesson.name);
  const [status, setStatus] = useState<string>(lesson.status )
  const [period, setPeriod] = useState<string>(lesson.period)  
  const [location, setLocation] = useState<string>(lesson.location || '')
  const [locationValues, setLocationValues] = useState<{value: string, label: string}[]>([
    { value: 'presentialAndTele', label: "Presencial e remoto" },
    { value: 'presential', label: "Presencial"},
    { value: 'tele', label: "Remoto" }])

  const [axisId, setAxisId] = useState<string | undefined>(lesson.axis?._id || undefined)
  const [axissValues, setAxissValues] = useState<{key: string, value: string}[]>([{key: lesson.axis?._id || '', value: lesson.axis?.type+" - Início "+lesson.axis?.dateStart || 'Turma não encontrada'}])
  const [availableAxiss, setAvailableAxiss] = useState<IAxis[]>([] as IAxis[]);
  const [chosenAxis, setChosenAxis] = useState<IAxis | undefined>();
  const [minDate, setMinDate] = useState<Dayjs | undefined >();
  const [maxDate, setMaxDate] = useState<Dayjs | undefined >();

  const [professorsValues, setProfessorsValues] = useState<{key: string, value: string}[]>([{key: lesson.professor?._id || "", value: lesson.professor?.name || ""}])
  const [professorId, setProfessorId] = useState<string | undefined>(lesson.professor?._id || undefined);
  const [chosenProfessor, setChosenProfessor] = useState<IProfessor | undefined>();
  const [professors, setProfessors] = useState<IProfessor[] | undefined>();
  
  const [isVisible, setIsVisible] = useState<{show: boolean, type: 'confirmation' | 'success' | 'error'}>({show: false, type: 'confirmation'})
  const [errorDescription, setErrorDescription] = useState<string>('')
  const [disclaimer, setDisclaimer] = useState<'emptyPeriod' | 'emptyDate' | 'invalidDate' |'emptyProfessor' | 'emptyStatus' | 'emptyAxis' | '' >('')
    
  const { loading: loadingAxiss } = useQuery<AxisPayload>(GET_AXIS, {
    onCompleted: (data) => {
      const available = data.axiss.axiss.filter((item): item is IAxis => item.status === 'onCourse')
      if (available) {
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
      setErrorDescription( lessonErrorMap[error.message])
      setIsVisible({show: true, type: 'error'})
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

  const [updateLesson, { loading: loadingUpdateLesson }] = useMutation<
    UpdateLessonPayload,
    UpdateLessonInput
  >(UPDATE_LESSON, {
    onCompleted: async(data) => {
      if(data.updateLesson.lesson) {
        await refetchLesson()
        setIsVisible({show: true, type: 'success'})
      }
      else {
        setErrorDescription( lessonErrorMap[data.updateLesson.errors.message])
        setIsVisible({show: true, type: 'error'})}     
    },
    onError: (error) => {
      setErrorDescription( lessonErrorMap[''])
      setIsVisible({show: true, type: 'error'})
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const handleUpdate = () => {
    updateLesson({
      variables: {
        updateLessonInput: {
          lessonId: lesson._id,
          name: name !== lesson.name ? name : undefined,
          period: period !== lesson.period ? period : undefined,
          location: location !== lesson.location ? location : undefined,
          date: transformFullDatePicker(date) !== lesson.date ? date?.toDate().toISOString() : undefined,
          status,
        },
      },
    })
  }

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
    setDisclaimer('')
    setIsVisible({show: true, type: 'confirmation'})
  }

  
const setAxis = (id: string) => {
  const axisFound = availableAxiss.find((axis): axis is IAxis => axis._id === id)
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
  const min = revertDatePicker(availableAxiss.find((axis): axis is IAxis=>axis._id.toString() === id.toString())?.dateStart, 'start')
  const max = revertDatePicker(availableAxiss.find((axis): axis is IAxis=>axis._id.toString() === id.toString())?.dateEnd, 'end')
  setMinDate(min)
  setMaxDate(max)

}

  const setProfessor = (id: string) => {
    setProfessorId(id)
    const professorFound = professors?.find((professor): professor is IProfessor => professor._id.toString() === id.toString())
    setChosenProfessor(professorFound)
  }
    
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

  return (
    <>
      <Container>
        {!loadingUpdateLesson ? (
          <>
            <h2>Atualização de aula</h2>

            <Label>Nome</Label>
            <Input
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setName(e.currentTarget.value);
              }}
              name={"name"}
              placeholder={lesson.name}
              autoComplete={"false"}
              label=''
              defaultValue={lesson.name}
            />
            <h1 style={{width:'100%', marginTop: "2%"}} key="axisLabel">Turma</h1>
            <Select
              key="axis"
              options={axissValues}
              onSelect={setAxis}
            />

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
                  placeholder={transformFullDatePicker(date)}
                  defaultValue={date}
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
            </DateContainer>
            <h1 style={{width:'100%', marginBottom: "2%",marginTop: "2%"}} key="locationLabel">Modalidade</h1>
            <Radio.Group
              style={{ marginBottom: "2%", width: "100%", justifyContent: "flex-start"}}
              value={location}
              options={locationValues}
              onChange={(e) => {
                if(e.target.value === 'presentialAndTele' || e.target.value === 'presential' || e.target.value === 'tele') setLocation(e.target.value)
                }}
            />

            <Label>Professor</Label>
            <Select
              onSelect={setProfessor}
              options={professorsValues}
            />

            
            <Disclaimer disclaimer={disclaimer} />
            <Button
              key={`update_lesson_button`}
              name={`update_lesson_button`}
              onPress={() => handleConfirmation()}
              text="Atualizar Aula"
            />
          </>
        ) : (
          <Loading />
        )}
      </Container>
      
      <MutationModal
      key={'deleteLessonMutationModal'}
      show={isVisible.show}
      stage={isVisible.type}
      onPressClose={() => setIsVisible({show: false, type: 'confirmation'})}

      onPressMutate={() => {
          handleUpdate()
        }
      }
      onPressError={() => setIsVisible({show: false, type: 'error'})}
      onPressSuccess={() => {
        setIsVisible({show: false, type: 'confirmation'})   
      }}
      content={{
        confirmationTopText: 'Gostaria de atualizar esta aula?',
        errorDescription,
        successDescription: 'Aula atualizada com sucesso!',
      }}
      loading={loadingUpdateLesson}
      children={<LessonCard lesson={{...lesson}}/>}
    />
  </>
  );
};

export default UpdateLessonCard;

