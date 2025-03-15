import React, {ButtonHTMLAttributes, useEffect, useState } from 'react'
import { Container, Info, InfoContainer, ButtonContainer } from './styles'
import { FaDownload } from 'react-icons/fa'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  onPress: () => Promise<any>
  subtitle: string
  children?: React.ReactNode
  dbFile?: Boolean
  fileId?: string
}

const GeneratePdfButton: React.FC<IconButtonProps> = ({ children, title, subtitle, onPress, fileId, dbFile, ...rest}) => {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `query { downloadFile(fileId: "${fileId}") }`,
        }),
      });
    
      const { data } = await response.json();
      setPdfBase64(data.downloadFile);
    };
    if(fileId && dbFile) fetchPDF()
  }, [fileId, dbFile]);
  
  

  const downloadPDF = () => {
    if (!pdfBase64) return;
  
    const link = document.createElement("a");
    link.href = pdfBase64;
    link.download = "documento.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = async () => {
    console.log('apertei')
    if(fileId && dbFile) {
      downloadPDF()
    } else {
      const data = await onPress();
    }
    
  };

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
          {pdfBase64 && dbFile && (
            <iframe src={pdfBase64} width="100%" height="500px" title='frame'></iframe>
          )}
          <button onClick={handleClick}>
            {<FaDownload size={25} color='#2d76b2' style={{margin: '2px'}} />}
            <h5>{subtitle}</h5>
          </button>
      </ButtonContainer>
        </Info>
      </InfoContainer>
    </Container>
  )
}

export default GeneratePdfButton

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