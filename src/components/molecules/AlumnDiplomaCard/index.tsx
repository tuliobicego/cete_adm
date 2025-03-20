import React, { useState } from "react";
import { IAlumn } from "../../../types/alumn";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaAward } from "react-icons/fa";
import { dateToStringRed, stringToDateRed } from "../../../utils/date/date";
import carregarImagemSVGParaBase64 from "../../../utils/image/logo";
import diplomaTemplate from "./diplomaTemplate";
import GeneratePdfButton from "../../atoms/GeneratePdfButton";
import { useLazyQuery } from "@apollo/client";
import { GET_FILE_64 } from "../../../api/database/queries/getFile";


interface AlumnDiplomaCardProps {
  alumn: IAlumn;
  children?: any
}

const AlumnDiplomaCard: React.FC<AlumnDiplomaCardProps> = ({ alumn, children }) => {
  const [getSign, { loading: loadingSign, data }] = useLazyQuery(GET_FILE_64, {
        
    variables: { fileId: process.env.REACT_APP_ADM_SIGN_ID },
    onCompleted: (data) => {
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });
  

  const generatePDF = async () => {
    const {data} = await getSign()
    console.log({data})
    
    const today = dateToStringRed(new Date())
    const alumnAxis = alumn?.axis?.length ? [...alumn?.axis]?.sort((a,b)=>stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime()) : undefined
    const dateStartDate =alumnAxis?.length ? stringToDateRed(alumnAxis[0].dateStart) : undefined
    const dateStartStr = dateStartDate ? dateToStringRed(dateStartDate) : null
    dateStartDate?.setFullYear(dateStartDate.getFullYear()+1)
    const dateEndStr = dateStartDate ? dateToStringRed(dateStartDate) : null
    // 🔹 1. Carregar o HTML salvo e substituir os placeholders pelos dados do aluno
    

    // 🔹 2. Criar um elemento div temporário para renderizar o HTML
    const div = document.createElement("TEMP");
    div.innerHTML = diplomaTemplate(today, dateStartStr, dateEndStr, alumn, data.downloadFileBase64)
    document.body.appendChild(div);

    // 🔹 3. Converter o HTML para imagem usando html2canvas
    const canvas = await html2canvas(div, { scale: 2 });
    const logoBase64 = await carregarImagemSVGParaBase64("moldura2.png");
    const imgData = canvas.toDataURL("./moldura2.png");

    // 🔹 4. Criar um novo PDF e inserir a imagem
    const pdf = new jsPDF("l", "mm", "a4");
    //const imgWidth = 190;
    //const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgWidth = 350; // 🟢 Mesma largura do PDF em mm
    const imgHeight = 210;

    if(typeof logoBase64 == "string") {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST")
    }

    if(typeof logoBase64 == "string") {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST")
    }
    
    // 🔹 5. Remover o HTML temporário do DOM
    document.body.removeChild(div);

    // 🔹 6. Baixar o PDF automaticamente
    pdf.save(`diploma_${alumn.name}.pdf`);
  };
  return (
    <GeneratePdfButton subtitle={"Baixar Certificado"} title={'Certificado de conclusão'} onPress={generatePDF} 
      children = {<FaAward  size={30} color='#2d76b2' style={{margin: '20px'}} />} 
    />
  );
};

export default AlumnDiplomaCard;
