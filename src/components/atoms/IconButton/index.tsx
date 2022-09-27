import React, {ButtonHTMLAttributes } from 'react'
import {IconBaseProps} from 'react-icons' 
import { Container } from './styles'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  icon?: React.ComponentType<IconBaseProps>
  onPress(): void
  label?: string
}

const IconButton: React.FC<IconButtonProps> = ({ label, onPress, icon: Icon, ...rest}) => {
  return (
    <Container>
      <button {...rest} onClick={onPress}>
        {Icon && <Icon size={25} color='#224b22' style={{margin: '2px'}} />}
        <h5>{label}</h5>
      </button>
    </Container>
  )
}

export default IconButton