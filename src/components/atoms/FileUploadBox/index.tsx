import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { InboxOutlined, UploadOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Container, Content } from "./styles";
import IconButton from "../IconButton";
import { FaBox } from "react-icons/fa";

const { Dragger } = Upload;

interface FileUploadBoxProps {
  title: string
  onFileSelect: (file: File) => void;
  multiUpload?: boolean
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({ title, onFileSelect, multiUpload }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Configuração do Upload
  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".pdf,.png",
    beforeUpload: (file: UploadFile) => {
      if (!file.size || file.size > 5 * 1024 * 1024) { // Limite de 5MB
        message.error("O arquivo excede o tamanho máximo de 5MB");
        return false; // Impede o upload
      }
      const isPDF = file.type === "application/pdf";
      const isPNG = file.type === "image/png";

      if (!isPDF && !isPNG) {
        message.error("Apenas arquivos PNG ou PDF são permitidos!");
        return false;
      }
      const convertedFile = new File([file as any], file.name, { type: file.type });

      setFileList([file]); // Atualiza a lista de arquivos
      onFileSelect(convertedFile)
      
      return false; // Impede upload automático pelo Ant Design
    },
    onRemove: (file: UploadFile) => {
      setFileList([]);
    },
    fileList, // Define a lista de arquivos exibidos
  };

  // Função para enviar os dados
  const handleSubmit = () => {
    if (fileList.length === 0) {
      message.error("Por favor, anexe um arquivo PNG ou PDF.");
      return;
    }

    message.success("Arquivo anexado com sucesso!")
    //console.log("📎 Arquivo:", fileList[0])
  };

  return (
    <Container>
        <h1>{title}</h1>
        
      <Content>         
          {fileList.length > 0 ? 
            <> 
              <Dragger {...uploadProps} style={{ marginBottom: 10 }}>
              <p className="ant-upload-drag-icon">
                <IconButton style={{background: 'transparent'}} name={''} onPress={()=>setFileList([])} icon={FaBox} />
              </p>
              <p className="ant-upload-text">Arquivo Carregado</p>
              </Dragger>
            </> 
            :
            <> 
              <Dragger {...uploadProps} style={{ marginBottom: 10 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Arraste e solte um arquivo aqui</p>
              <p className="ant-upload-hint">Ou clique para selecionar um arquivo</p>
              </Dragger>
            </> 
        }
      </Content>
      <Content>
        {fileList.length === 0 ? null : multiUpload ? 
        <Button
        type="primary"
        icon={<MinusCircleOutlined/> }
        onClick={()=>setFileList([])}
        block
      >
        Remover
      </Button> : 
        <Button
          type="primary"
          icon={fileList.length > 0 ? <MinusCircleOutlined/> : <UploadOutlined />}
          onClick={fileList.length > 0 ? ()=>setFileList([]) : handleSubmit}
          block
        >
         { fileList.length > 0 ? 'Remover' : 'Carregar'}
        </Button>}
      </Content>
    </Container>
  );
};

export default FileUploadBox;
