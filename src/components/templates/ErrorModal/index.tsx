import React, {useState, useEffect} from 'react'
import { AnimatedContainer, AnimatedModalContainer, ButtonsContainer, Content } from './styles'
import {ReactComponent as XCircleIcon} from '../../../assets/svg/x_circle_red.svg'
import Button from '../../atoms/Button'
import Loading from '../../atoms/Loading'
import IconButton from '../../atoms/IconButton'


interface ContentProps {
  errorDescription: string
}

interface ModalProps {
  loading: boolean
  onPressClose(): void
  onPressError(): void
  onPressTryAgain?: ()=>Promise<void>
  content: ContentProps
  show: boolean
  children?: React.ReactNode
}

const ErrorModal: React.FC<ModalProps> = ({ children, content, show, loading, onPressClose, onPressError, onPressTryAgain }) => {
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
        
        {show ? 
          <Content>
            <IconButton
                color={'#cc00005d'}
                name='error_button_icon'
                key='error_button_icon'
                onPress={onPressError}
                icon={XCircleIcon}
              />
              <h2 style={{color: '#c00'}}>Algo deu errado</h2>
              <h1>{content.errorDescription}</h1>
              <ButtonsContainer>
                <Button name='error_button' key='error_button' onPress={onPressClose} style={{background: '#FF638480', width: '80%'}} text={ 'Fechar'}/>
                { onPressTryAgain && <Button name='try_button' key='try_button' onPress={() => onPressTryAgain?.()} style={{background: '#2ECC7180', width: '80%'}} text={ 'Tentar novamente'}/> }
              </ButtonsContainer>
          </Content> 
        : null}        
      </AnimatedModalContainer>
    </AnimatedContainer>
  ) 
}


export default ErrorModal