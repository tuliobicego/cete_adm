import { IAlumn, IAxis, ILesson } from "../../../types";
import { lessonPeriodMap } from "../../../utils/maps/date";
import { alumnStatusMap } from "../../../utils/maps/status";

function lessonCallTemplate(lesson: ILesson | null, alumns: IAlumn[] | null, axis: IAxis | null): string { 
    return( `
    <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Presença</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f5f5f5;
        }
        .container {
            width: 800px;
            min-height: 100vh;
            padding: 30px;
            background-color: white;
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo {
            width: 120px; /* Ajuste o tamanho do logo conforme necessário */
            height: auto;
        }
        h1, h2, H3 {
            margin-bottom: 10px;
        }
        .info {
            font-size: 16px;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .info strong {
            font-weight: bold;
        }
        table {
            align-self: center;
            width: 80%;
            border-collapse: collapse;
            margin-top: 10px;
            page-break-inside: avoid;
        }
        th, td {
            border-bottom: 1px solid black;
            text-align: left;
            height: 30px;
        }
        th {
            background-color: #ddd;
        }
        @page {
            size: A4 portrait; /* Define o modo retrato para impressão */
            margin: 20mm;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">

            <div class="info">
                <h3>Lista de Presença</h3>
                <p><strong>Aula:</strong> ${lesson?.name}</p>
                <p><strong>Data:</strong> ${lesson?.date}</p>
                <p><strong>Período:</strong> ${lessonPeriodMap[lesson?.period || ""]}</p>
                <p><strong>Professor:</strong> ${lesson?.professor?.name}</p>
                <p><strong>Turma:</strong> ${lesson?.axis?.type+' - '+lesson?.axis?.dateStart }</p>
            </div>
            
            <img src="logoCETE40.svg" alt="Logo" class="logo"> <!-- Altere para o caminho correto do logo -->
            

            
        </div>


        <table>
            <tr>
                <th>Nome</th>
                <th>Assinatura</th>
            </tr>
            ${alumns?.map(alumn => `
            <tr>
                <td>${alumn.name}</td>
                <td ></td>
            </tr>
            `).join("")}
        </table>
    </div>

</body>
</html>



  `)
};

  export default lessonCallTemplate