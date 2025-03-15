import React, {ButtonHTMLAttributes } from 'react'
import { Container, Info, InfoContainer, ButtonContainer } from './styles'
import { FaDownload } from 'react-icons/fa'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  onPress: () => Promise<any>
  subtitle: string
  children?: React.ReactNode
}

const DownloadButton: React.FC<IconButtonProps> = ({ children, title, subtitle, onPress, ...rest}) => {

  

  

  return (
    <Container>
      <InfoContainer>
        {children}
      </InfoContainer>
        <InfoContainer>
          <h2>{title}</h2>
        </InfoContainer>
      <InfoContainer>
        <Info>
        <ButtonContainer>
          <button onClick={onPress}>
            {<FaDownload size={25} color='#2d76b2' style={{margin: '2px'}} />}
            <h5>{subtitle}</h5>
          </button>
      </ButtonContainer>
        </Info>
      </InfoContainer>
    </Container>
  )
}

export default DownloadButton

/*

  const handleDownload = async (fileId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_NODE_ENV === "production"
          ? `${process.env.REACT_APP_BACKEND_URL}/download/${fileId}`
          : `http://localhost:3333/download/${fileId}`);
      if (!response.ok) throw new Error("Erro ao baixar o arquivo");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "arquivo_baixado.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
    }
  };
  */