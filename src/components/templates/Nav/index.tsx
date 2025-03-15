import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from "../../../api/services/firebase/auth";
import IconButton from '../../atoms/IconButton'
import { IconContainer, PageTitle, Container, Side, Shadow, Burger, NotHidden, PageIconContainer, Header, Content, SideContainer, Label, Menu, Outline, StyledDrawer} from './styles'
import {ReactComponent as CloseIcon} from '../../../assets/svg/x.svg'
import {ReactComponent as LogoIcon} from '../../../assets/svg/logoCETE40.svg'
import { Avatar, Col, Tooltip } from 'antd'
import {pageTitleMap } from '../../../utils/maps/page'
import { FaBars, FaChalkboardTeacher, FaChartLine, FaHome, FaMoneyBillWave, FaRunning, FaUserFriends, FaUserTie } from 'react-icons/fa';
import { FaPeopleLine } from "react-icons/fa6";

type Props = {
  children?: React.ReactNode
};


const Nav: React.FC<Props> = ({children}) => {
  const [path, setPath] = useState<'Painel' | 'Aulas' | 'Professores' | 'Alunos' | 'Finanças' | 'Turmas' | 'Estatísticas'>('Painel')
  const { logOut, user } = useAuth()
  const location = useLocation()
  console.log(location.pathname)

  const [visible, setVisibility] = useState(false)

  const showDrawer = () => {
    setVisibility(!visible)
  }

  const onClose = () => {
    setVisibility(!visible)
  }
  const navigate = useNavigate()
    const navigateTo = (page: string) => {
      navigate(`/${page}`)
    }

  const PathList = ({label}) => {
    return (
      <PageIconContainer>
        
        <Tooltip placement='rightBottom' title='Painel'><IconContainer onClick={() => {navigateTo(""); setPath('Painel')}} background-color={location.pathname === '/panel' ?  '#2e4b2e33' : 'transparent'}><IconButton name='Painel' onPress={() => {navigateTo(""); setPath('Painel')}} label={label ? 'Painel' : ''}  icon={FaHome}/></IconContainer></Tooltip>
        <Tooltip placement='rightBottom' title='Alunos'><IconContainer onClick={() => {navigateTo("alumns"); setPath('Alunos')}}><IconButton name='Alunos' onPress={() => {navigateTo("alumns"); setPath('Alunos')}} label={label ? 'Alunos' : ''}  icon={FaUserFriends}/></IconContainer></Tooltip>
        <Tooltip placement='rightBottom' title='Professores'><IconContainer onClick={() => {navigateTo("professors"); setPath('Professores')}}><IconButton name='Professores' onPress={() => {navigateTo("professors"); setPath('Professores')}} label={label ? 'Professores' : ''}  icon={FaUserTie}/></IconContainer></Tooltip>
        <Tooltip placement='rightBottom' title='Turmas'><IconContainer onClick={() => {navigateTo("axis"); setPath('Turmas')}}><IconButton name='Turmas' onPress={() => {navigateTo("axis"); setPath('Turmas')}} label={label ? 'Turmas' : ''}  icon={FaPeopleLine}/></IconContainer></Tooltip>
        <Tooltip placement='rightBottom' title='Aulas'><IconContainer onClick={() => {navigateTo("lessons"); setPath('Aulas')}}><IconButton name='Aulas' onPress={() => {navigateTo("lessons"); setPath('Aulas')}} label={label ? 'Aulas' : ''}  icon={FaChalkboardTeacher}/></IconContainer></Tooltip>
        {user?.role === 'adm' && <Tooltip placement='rightBottom' title='Finanças'><IconContainer onClick={() => {navigateTo("payments"); setPath('Finanças')}}><IconButton name='Finanças' onPress={() => {navigateTo("payments"); setPath('Finanças')}} label={label ? 'Finanças' : ''}  icon={FaMoneyBillWave}/></IconContainer></Tooltip>}
        {user?.role === 'adm' && <Tooltip placement='rightBottom' title='Estatísticas'><IconContainer onClick={() => {navigateTo("indicators"); setPath('Estatísticas')}}><IconButton name='Estatísticas' onPress={() => {navigateTo("indicators"); setPath('Estatísticas')}} label={label ? 'Estatísticas' : ''}  icon={FaChartLine}/></IconContainer></Tooltip>}
      </PageIconContainer>
    )
  }

  return (
    <Container>
      <Header>
            <IconButton name='OpenMenu' onPress={showDrawer} icon={FaBars}/>
        <IconButton style={{height: '3rem', display: 'flex', width: '4rem', marginLeft: "1rem"}} name='toDashborad' onPress={() => navigateTo('')} icon={LogoIcon}/>
        <PageTitle><h1 style={{fontSize: '25px'}}>{pageTitleMap[location.pathname]}</h1></PageTitle>
        <IconButton name='LogOut' onPress={logOut} icon={FaRunning}/>
      </Header>
      <Content>
        {children}
      </Content>
      <SideContainer>
        <Side>
          <NotHidden>
            <IconButton name='OpenMenu' style={{marginBottom:"5rem"}} onPress={showDrawer} icon={FaBars}/>
            <Avatar/>
            <PathList label={false}/>
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
            
        </Side>
        <Shadow/>
        <StyledDrawer
          placement="left"
          open={visible}
          closeIcon={<IconButton name='CloseMenu' onPress={onClose} icon={CloseIcon}/>}
          style={{backgroundColor: '#eaeaea'}}
        >
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>CETE</Menu>
              </Col>
            </Label>
          </Col>
          
          <Col style={{ marginBottom: "2.5rem", alignItems: 'stretch', justifyContent: 'center', display: 'flex' }}>
            <Avatar/>
          </Col>
          <PathList label={true} />
        </StyledDrawer>
      </SideContainer>
    </Container>
  )
}

export default Nav