import React from 'react'
import { Container, Content } from './styles'

type Props = {
  children?: React.ReactNode
};

const Body: React.FC<Props> = ({children}) => {
  return (
    <Container>
      <Content>
        {children}
      </Content>
    </Container>
  )
}

export default Body