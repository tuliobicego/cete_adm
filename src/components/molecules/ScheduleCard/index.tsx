import React, { useState } from "react";
import { Container, Info, Box } from "./styles";

import { Tag } from "antd";
import IconButton from "../../atoms/IconButton";
import {ReactComponent as CloseIcon} from '../../../assets/svg/x.svg'
import {ReactComponent as EditIcon} from '../../../assets/svg/edit.svg'
 
interface ScheduleCardProps {
  //schedule: ISchedule;
  schedule: {date: string, alumn?: string, professor?: string}
  refresh(): void;
  children?: any,
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  children,
  refresh,
}) => {
  const [content, setContent] = useState<'update' | ''>('')
  
  return (
    <Container>
          <Box>
            <div>
            <h3>{schedule.date}</h3>
            <h2>Local: CETE</h2>
            </div>
            <IconButton
            name='update_schedule_button'
            label={content === 'update' ?  'Fechar' :'Alterar horário'}
            onPress={content === 'update' ? () => setContent(''): () =>setContent('update')} 
            icon={content === 'update' ? CloseIcon : EditIcon}
            />

          </Box>
          <Info>
            {schedule.alumn && <h2>aluno: {schedule.alumn}</h2>}
            {schedule.professor && <h2>
              Fisioterapeuta responsável: Dr. {schedule.professor}
            </h2>}
          </Info>
          
      
          {children}
      
    </Container>
  );
};

export default ScheduleCard;
