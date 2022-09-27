import React, {ButtonHTMLAttributes } from 'react'
import { Container, ButtonGeneral } from './styles'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  onPress(): void
  text?: string
}

const Button: React.FC<IconButtonProps> = ({ text, onPress, ...rest}) => {

  return (
    <Container>
      <ButtonGeneral {...rest} onClick={onPress}>
        <h1 style={{color: '#000000', fontSize: '16px'}}>{text}</h1>
      </ButtonGeneral>
    </Container>
  )
}

export default Button