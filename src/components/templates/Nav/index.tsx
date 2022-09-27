import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from "../../../api/services/firebase/auth";
import IconButton from '../../atoms/IconButton'
import { IconContainer, PageTitle, Container, Side, Shadow, Burger, NotHidden, PageIconContainer, Header, Content, SideContainer, Label, Menu, Outline} from './styles'
import {ReactComponent as IndicatorsIcon} from '../../../assets/svg/trending-up.svg'
import {ReactComponent as AthletsIcon} from '../../../assets/svg/users.svg'
import {ReactComponent as FinanceIcon} from '../../../assets/svg/dollar-sign.svg'
import {ReactComponent as CompanyIcon} from '../../../assets/svg/home.svg'
import {ReactComponent as AgendaIcon} from '../../../assets/svg/calendar.svg'
import {ReactComponent as PanelIcon} from '../../../assets/svg/layout.svg'
import {ReactComponent as MenuIcon} from '../../../assets/svg/menu.svg'
import {ReactComponent as CloseIcon} from '../../../assets/svg/x.svg'
import {ReactComponent as LogOutIcon} from '../../../assets/svg/log-out.svg'
import {ReactComponent as LogoIcon} from '../../../assets/svg/layout.svg'
import { Drawer, Avatar, Col, Tooltip } from 'antd'
import {pageTitleMap } from '../../../utils/maps/page'

type Props = {
  children?: React.ReactNode
};


const Nav: React.FC<Props> = ({children}) => {
  const [path, setPath] = useState<'Painel' | 'Atletas' | 'Estatísticas'>('Painel')
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

  const PathList = ({label}) => {
    const navigate = useNavigate()
    const navigateTo = (page: string) => {
      navigate(`/${page}`)
    }
    return (
      <PageIconContainer>
        
        <Tooltip placement='rightBottom' title='Painel'><IconContainer onClick={() => {navigateTo(""); setPath('Painel')}} background-color={location.pathname === '/' ?  '#2e4b2e33' : 'transparent'}><IconButton name='Painel' onPress={() => {navigateTo(""); setPath('Painel')}} label={label ? 'Painel' : ''}  icon={PanelIcon}/></IconContainer></Tooltip>
        <Tooltip placement='rightBottom' title='Atletas'><IconContainer onClick={() => {navigateTo("athlets"); setPath('Atletas')}}><IconButton name='Atletas' onPress={() => {navigateTo("athlets"); setPath('Atletas')}} label={label ? 'Atletas' : ''}  icon={AthletsIcon}/></IconContainer></Tooltip>
        {user?.type === 'admin' && <Tooltip placement='rightBottom' title='Estatísticas'><IconContainer onClick={() => {navigateTo("indicators"); setPath('Estatísticas')}}><IconButton name='Estatísticas' onPress={() => {navigateTo("indicators"); setPath('Estatísticas')}} label={label ? 'Estatísticas' : ''}  icon={IndicatorsIcon}/></IconContainer></Tooltip>}
      </PageIconContainer>
    )
  }

  return (
    <Container>
      <Header>
        <IconButton name='OpenMenu' onPress={showDrawer} icon={MenuIcon} style={{position: 'absolute', left: -5, top: -1}}/>
        <div style={{height: '70%', display: 'flex', width: '20%', marginLeft: '2%'}}><LogoIcon/></div>
        <PageTitle><h1 style={{fontSize: '25px'}}>{pageTitleMap[location.pathname]}</h1></PageTitle>
        <IconButton name='LogOut' onPress={logOut} icon={LogOutIcon}/>
      </Header>
      <Content>
        {children}
      </Content>
      <SideContainer>
        <Side>
          <NotHidden>
            <IconButton name='OpenMenu' onPress={showDrawer} icon={MenuIcon}/>
            <Avatar/>
            <PathList label={false}/>
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
            
        </Side>
        <Shadow/>
        <Drawer
          placement="left"
          visible={visible}
          closeIcon={<IconButton name='CloseMenu' onPress={onClose} icon={CloseIcon}/>}
          style={{backgroundColor: '#2e602e74'}}
          drawerStyle={{backgroundColor: '#2e602e14'}}
        >
        <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>1Home</Menu>
              </Col>
            </Label>
          </Col>
          
        <Col style={{ marginBottom: "2.5rem", alignItems: 'stretch', justifyContent: 'center', display: 'flex' }}>
          <Avatar/>
          </Col>
          <PathList label={true} />
        </Drawer>
        </SideContainer>
    </Container>
  )
}

export default Nav