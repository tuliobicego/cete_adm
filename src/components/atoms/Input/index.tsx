import React, {InputHTMLAttributes} from 'react'
import {IconBaseProps} from 'react-icons' 
import { Container, InputBox } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  icon?: React.ComponentType<IconBaseProps>
  label?: string
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, ...rest}) => {
  return (
    <Container>
    {label && <h1 style={{fontSize: '12px'}}>{label}</h1>}
    <InputBox>
      {Icon && <Icon size={25} color='#224b22'/>}
      <input {...rest} />
    </InputBox>
    </Container>
  )
}

export default Input