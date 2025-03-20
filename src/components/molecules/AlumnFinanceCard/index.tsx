import React from "react";
import { IAlumn } from "../../../types/alumn";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { dateToStringRed, stringToDateRed } from "../../../utils/date/date";
import carregarImagemSVGParaBase64 from "../../../utils/image/logo";
import alumnFinanceTemplate from "./alumnFinanceTemplate";
import GeneratePdfButton from "../../atoms/GeneratePdfButton";
import { maskValue } from "../../../utils/masks/masks";
import { getMissingMonths } from "../../../utils/verifiers/verifiers";
import { paymentTypeMap } from "../../../utils/maps/type";
import { useLazyQuery } from "@apollo/client";
import { GET_FILE_64 } from "../../../api/database/queries/getFile";


interface AlumnFinanceCardProps {
  alumn: IAlumn;
  children?: any
}

const AlumnFinanceCard: React.FC<AlumnFinanceCardProps> = ({ alumn, children }) => {
  const [getSign, { loading: loadingSign, data }] = useLazyQuery(GET_FILE_64, {
        
    variables: { fileId: process.env.REACT_APP_FINANCE_SIGN_ID },
    onCompleted: (data) => {
    },
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2));
    },
    fetchPolicy: "network-only",
  });
  const today = dateToStringRed(new Date())
  const enrollmentDate = alumn.enrollmentDate ? stringToDateRed(alumn.enrollmentDate) : null
  enrollmentDate?.setFullYear(enrollmentDate.getFullYear()+1)

  

  const generatePDF = async () => {
    const {data} = await getSign()
    
    const div = document.createElement("TEMP");
    let enrollmentValue = ""
    let counter = 0
    const payments = alumn.payments?.map((payment) => {
      if(payment.type === "enrollment")  {
        enrollmentValue = maskValue(payment.value)
      }
      counter += parseFloat(payment.value)
      return payment
    })?.sort((a,b) => stringToDateRed(a.date).getTime() - stringToDateRed(b.date).getTime())
    if(!payments) return
    let financeStatus
    let missingMonths
    console.log(alumn.axis)
    let axiss = alumn.axis ? [...alumn.axis] : undefined
    axiss?.sort((a,b)=>stringToDateRed(a.dateStart).getTime() - stringToDateRed(b.dateStart).getTime())
    console.log(axiss?.length)
    const firstAxis = axiss?.shift()
    if(firstAxis) {
      console.log({axiss})
      const monthsPayed = alumn.payments?.map((payment) => paymentTypeMap[payment.type]).filter(type=>type !== 'matrícula')
      //console.log({monthsPayed})
      missingMonths = getMissingMonths(firstAxis.dateStart, monthsPayed || [])
      console.log(missingMonths)
      if(missingMonths.length) {
        financeStatus = 'Inadimplente'
      }
      else financeStatus = 'Adimplente'
    } else {financeStatus = 'Adimplente'}
    console.log(missingMonths)

    const total = counter.toString()
    div.innerHTML = alumnFinanceTemplate(today, alumn, payments, data.downloadFileBase64, missingMonths, financeStatus, enrollmentValue, total)
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
    pdf.save(`extrato_${alumn.name}.pdf`);
  };
  return (
    <GeneratePdfButton subtitle={"Baixar Extrato"} title={'Extrato financeiro'} onPress={generatePDF} 
      children = {<FaFileInvoiceDollar  size={30} color='#2d76b2' style={{margin: '20px'}} />}
    />
  );
};

export default AlumnFinanceCard;
