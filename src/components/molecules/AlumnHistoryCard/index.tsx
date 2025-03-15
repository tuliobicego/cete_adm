import React from "react";
import { IAlumn } from "../../../types/alumn";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaArchive } from "react-icons/fa";
import { dateToStringRed, stringToDateRed } from "../../../utils/date/date";
import carregarImagemSVGParaBase64 from "../../../utils/image/logo";
import historyTemplate from "./historyTemplate";
import GeneratePdfButton from "../../atoms/GeneratePdfButton";

interface AlumnHistoryCardProps {
  alumn: IAlumn;
  children?: any
}

const AlumnHistoryCard: React.FC<AlumnHistoryCardProps> = ({ alumn, children }) => {

  

  

  const generatePDF = async () => {
    const today = dateToStringRed(new Date())
    console.log(alumn.axis)
    const alumnAxis = alumn.axis?.length ? [...alumn.axis] : []
    alumnAxis.sort((a,b)=>stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())
    console.log(alumnAxis)
    const dateStartDate =alumnAxis?.length ? stringToDateRed(alumnAxis[0].dateStart) : undefined
    const dateStartStr = dateStartDate ? dateToStringRed(dateStartDate) : null
    dateStartDate?.setFullYear(dateStartDate.getFullYear()+1)
    const dateEndStr = dateStartDate ? dateToStringRed(dateStartDate) : null
    // 🔹 1. Carregar o HTML salvo e substituir os placeholders pelos dados do aluno
    

    // 🔹 2. Criar um elemento div temporário para renderizar o HTML
    const div = document.createElement("TEMP");
    div.innerHTML = historyTemplate(today, dateStartStr, dateEndStr, alumn)
    document.body.appendChild(div);

    // 🔹 3. Converter o HTML para imagem usando html2canvas
    const canvas = await html2canvas(div, { scale: 2 });
    const logoBase64 = await carregarImagemSVGParaBase64("logoCETE40.svg");
    const imgData = canvas.toDataURL("./logoCETE40.svg");

    // 🔹 4. Criar um novo PDF e inserir a imagem
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if(typeof logoBase64 == "string") {
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, undefined, "FAST")
    }
    
    // 🔹 5. Remover o HTML temporário do DOM
    document.body.removeChild(div);

    // 🔹 6. Baixar o PDF automaticamente
    pdf.save(`historico_${alumn.name}.pdf`);
  };
  return (
    <GeneratePdfButton subtitle={"Baixar Histórico"} title={'Histórico escolar'} onPress={generatePDF} 
      children = {<FaArchive  size={30} color='#2d76b2' style={{margin: '20px'}} />}
    />
  );
};

export default AlumnHistoryCard;
