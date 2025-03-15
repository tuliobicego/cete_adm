import React from 'react';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Statistic, Tag } from 'antd';
import { Container, Info, InfoContainer } from './styles';
import {  axisTypeColorMap } from '../../../utils/maps/color';
import { axisTypeMap } from '../../../utils/maps/type';

interface GradeAndFrequenceProps {
    grade?: string
    axisType: string
    frequence: string
    axisStatus?: string
  }


const GradeAndFrequence: React.FC<GradeAndFrequenceProps> = ({grade, frequence, axisType}) => (
    <Container>
        <Tag
          color={axisTypeColorMap[axisType]}
          style={{
            width: "20%",
            textAlign: "center",
            borderRadius: ".5rem",
            fontSize: "16px",
            marginBottom: "16px",
            height: '30%',
          }}
          key={axisType}
        >
        {axisTypeMap[axisType].toUpperCase()}
      </Tag>
  <InfoContainer>
    <Info >
        {grade ? (<Statistic
          title={"Nota"}
          value={grade}
          precision={2}
          valueStyle={{ color: grade && parseFloat(grade) >= 7 ? '#3f8600' : '#cf1322' }}
          prefix={grade && parseFloat(grade) >= 7 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        />): null}
    </Info>
    <Info >
        { frequence ? (<Statistic
          title={"Frequência"}
          value={frequence}
          precision={1}
          valueStyle={{ color: parseFloat(frequence) >= 75 ? '#3f8600' : '#cf1322' }}
          prefix={parseFloat(frequence) >= 75 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          suffix="%"
          
        />) : null}
    </Info>
  </InfoContainer>
    </Container>
);

export default GradeAndFrequence;