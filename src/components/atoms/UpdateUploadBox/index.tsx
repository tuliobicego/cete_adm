import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { InboxOutlined, MinusCircleOutlined, CloudDownloadOutlined} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { Container, Content } from "./styles";
import IconButton from "../IconButton";
import { FaBox } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "../../../api/database/mutations/uploadFile";
import { useNavigate } from "react-router";
import Loading from "../Loading";

const { Dragger } = Upload;

interface UpdateUploadBoxProps {
  title: string
  type: string
  entity: string
  entityId: string
}

const UpdateUploadBox: React.FC<UpdateUploadBoxProps> = ({title, type, entity, entityId }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();

  const handleReload = () => {
    navigate(0); 
  };

  const [uploadFile, {loading: loadingFile}] = useMutation(UPLOAD_FILE, {   
      fetchPolicy: "no-cache",
    });
  
    const sendFileToServer = async () => {
      if (entity === 'alumn') {
        
        try {
          await uploadFile({ variables: { file: fileList[0], type, entity, entityId } });
          handleReload()
        } catch (error) {
          console.error(error);
          
        }

      }
    };

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
      console.log({convertedFile})
      return false; // Impede upload automático pelo Ant Design
    },
    onRemove: (file: UploadFile) => {
      setFileList([]);
    },
    fileList, // Define a lista de arquivos exibidos
  };

  if(loadingFile) return <Container><Loading/></Container>

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
        {fileList.length > 0 ?<>
          <Button
            type="primary"
            icon={<MinusCircleOutlined/>}
            onClick={()=>setFileList([])}
            block
          >
          { 'Remover' }
          </Button> 
          <Button
            type="primary"
            icon={<CloudDownloadOutlined/>}
            onClick={async()=>{await sendFileToServer()} }
            block
          >
          {'Carregar'}
          </Button>
        </> : null}
      </Content>
    </Container>
  );
};

export default UpdateUploadBox;
