import React from "react";
import { Container, Info, InfoContainer } from "./styles";
import IconButton from "../../atoms/IconButton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaClipboardList, FaDownload } from "react-icons/fa";
import lessonCallTemplate from "./lessonCallTemplate";
import { ILesson } from "../../../types";

interface LessonCallCardProps {
  lesson: ILesson;
  children?: any
}

const LessonCallCard: React.FC<LessonCallCardProps> = ({ lesson, children }) => {
  


const generatePDF = async () => {
    // 🔹 1. Carregar os dados da aula
    const axis = lesson.axis ? lesson.axis : null;
    const alumns = axis?.alumns ? axis.alumns : null;

    // 🔹 2. Criar um elemento div temporário para renderizar o HTML
    const div = document.createElement("TEMP");
    div.style.opacity = "0"; // Deixa invisível, mas ainda renderizável pelo html2canvas
    div.style.pointerEvents = "none"; // Evita interações do usuário
    div.innerHTML = lessonCallTemplate(lesson, alumns, axis);
    document.body.appendChild(div);

    // 🔹 3. Criar o PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 10;
    let yPosition = margin;

    // 🔹 4. Capturar apenas o cabeçalho e informações da aula
    const headerElement = div.querySelector(".header") as HTMLElement;
    if (headerElement) {
        const headerCanvas = await html2canvas(headerElement, { scale: 2 });
        const headerImg = headerCanvas.toDataURL("der.png");
        pdf.addImage(headerImg, "PNG", margin + 1, yPosition, pageWidth - 3 * margin, 50, undefined, "FAST");
        yPosition += 60;
    }

    // 🔹 5. Capturar e processar a tabela
    const tableElement = div.querySelector("table") as HTMLElement;

    if (tableElement) {
        const tableRows = Array.from(tableElement.querySelectorAll("tr"));

        for (let i = 0; i < tableRows.length; i++) {
            const rowCanvas = await html2canvas(tableRows[i], { scale: 2 });
            const rowImg = rowCanvas.toDataURL("der.png");

            // Se não houver espaço na página, cria uma nova
            if (yPosition + 15 > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }

            pdf.addImage(rowImg, "PNG", margin + 1, yPosition, pageWidth - 3 * margin, 10, undefined, "FAST");
            yPosition += 12; // Ajusta a posição para a próxima linha
        }
    }
    // 🔹 6. Remover o HTML temporário do DOM
    document.body.removeChild(div);

    // 🔹 7. Adicionar numeração de páginas
    const pageCount = pdf.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 40, pageHeight - 10);
    }

    // 🔹 8. Baixar o PDF automaticamente
    pdf.save(`chamada_${lesson.date}_${lesson.name}.pdf`);
};

  return (
    <Container>
    <InfoContainer>      
      <FaClipboardList size={30} color='#2d76b2' style={{margin: '20px'}} />      
   
        <h2>Chamada</h2>
      </InfoContainer>
    <InfoContainer>
      <Info>
        <IconButton
          name={"Baixar Chamada"}
          label={"Baixar Chamada"}
          onPress={generatePDF}
          icon={FaDownload}
        />
      </Info>
    </InfoContainer>
      {children}
    </Container>
  );
};

export default LessonCallCard;
