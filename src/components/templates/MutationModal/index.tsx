import React, {useState, useEffect} from 'react'
import { AnimatedContainer, AnimatedModalContainer, Content, ButtonContainer, Space, Header } from './styles'
import {ReactComponent as XCircleIcon} from '../../../assets/svg/x_circle_red.svg'
import {ReactComponent as CheckCircleIcon} from '../../../assets/svg/check-circle.svg'
import Button from '../../atoms/Button'
import Loading from '../../atoms/Loading'
import IconButton from '../../atoms/IconButton'


interface ContentProps {
  confirmationTopText: string
  successDescription: string
  errorDescription: string
}

interface ModalProps {
  loading: boolean
  onPressClose(): void
  onPressMutate(): void
  onPressError(): void
  onPressSuccess(): void
  content: ContentProps
  show: boolean
  stage: 'confirmation' | 'success' | 'error'
  children?: React.ReactNode
}

const MutationModal: React.FC<ModalProps> = ({ children, content, show, loading, onPressClose, onPressError, onPressSuccess,stage, onPressMutate }) => {
  const [state, setState] = useState({
    mode: '0',
    fade: 'out',
  })

  

  useEffect(() => {
    if(show){
      setState({
        mode: 'open',
        fade: 'in',
      })
    }else{
      setState({
        mode: 'close',
        fade: 'out',
      })
    }
  }, [show])

  return (
    <AnimatedContainer fade={state.fade} mode={state.mode}>
      <AnimatedModalContainer
        fade={state.fade} mode={state.mode}
      >
        {loading ? <Loading/> : null}
        {stage === 'confirmation' && !loading ? 
          <Content>
            <h2 style={{textAlign: 'center'}}>{content.confirmationTopText}</h2>
            <Space/>
            <Space/>
            <Space/>
            
              {children}
              <Space/>
            <ButtonContainer>
              <Button  name='confirm_button' key='confirm_button'  onPress={onPressMutate} style={{background: '#2ECC71', width: '50%'}} text={'Confirmar'}/>
            <Button  name='close_button' key='close_button'  onPress={onPressClose} style={{background: '#cc000072', width: '50%'}} text={'Fechar'}/>
            </ButtonContainer>
            </Content>
        : null}
        {stage === 'success' && !loading ?
          <Content>
            <Space/>
            <Header>        
              <IconButton
                name='success_button_icon'
                key='success_button_icon'
                onPress={() => {}}
                color={'#080c08'}
                icon={CheckCircleIcon}
              />
              <h2>Sucesso!</h2>
            </Header>
            <Space/>
            <Space/>        
            <h1>{content.successDescription}</h1>
            <Button  name='success_button' key='success_button'  onPress={onPressSuccess} style={{background: '#2e602e80', width: '50%'}} text={'Entendi'}/>
          </Content> 
        : null}
        {stage === 'error' && !loading ? 
          <Content>
            <Space/>
            <Header>      
              <IconButton
                  color={'#cc00005d'}
                  name='error_button_icon'
                  key='error_button_icon'
                  onPress={() => {}}
                  icon={XCircleIcon}
                />
                <h2 >Algo deu errado</h2>
            </Header>
            <Space/>
            <Space/>   
            <h1>{content.errorDescription}</h1> 
            <Button name='error_button' key='error_button' onPress={onPressError} style={{background: '#FF638480', width: '50%'}} text={ 'Entendi'}/>
          </Content> 
        : null}        
      </AnimatedModalContainer>
    </AnimatedContainer>
  )
}


export default MutationModal