import { IAlumn, IPayment } from "../../../types";
import { maskValue } from "../../../utils/masks/masks";
import { paymentTypeMap } from "../../../utils/maps/type";

function alumnFinanceTemplate(today: string, alumn: IAlumn, payments: IPayment[], late: string[] | undefined, financeStatus: string,  enrollmentValue: string| null, total: string ): string { 
    return( `
    <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Histórico Financeiro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: 40px;
        }
        .container {
            max-width: 900px;
            margin: auto;
            flex: 1; /* Faz o conteúdo expandir */
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Distribui melhor os elementos */
        }
        h2, h3 {
            text-align: center;
            margin-bottom: 15px;
        }
        .content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 10%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            padding-top: 10px;
            width: 50%;
            margin-top: 15%; /* Mantém o rodapé sempre no final */
            align-self: center;
        }
        .lineSign {
            margin-top: 15%;
            border-top: 1px solid #000;
        }
        .header {
            text-align: center;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header img {
            width: auto;
            height: 120px;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Cabeçalho -->
        <div class="header">
            <img src="logoCETE40.svg" alt="Logo CETE">
            <div>
                <h2>CENTRO DE TRAUMATO-ORTOPEDIA DO ESPORTE</h2>
                <h3>APRIMORAMENTO PROFISSIONAL EM FISIOTERAPIA ESPORTIVA</h3>
            </div>
        </div>
        
        <div class="content">
            <p><strong>Curso:</strong> APRIMORAMENTO PROFISSIONAL EM FISIOTERAPIA ESPORTIVA</p>
            <p><strong>Aluno(a):</strong> ${alumn.name} | <strong>CPF:</strong> ${alumn.cpf}</p>
            <p><strong>Data da Matrícula:</strong> ${alumn.enrollmentDate} | <strong>Valor:</strong> ${enrollmentValue}</p>

            <h3>Pagamentos Realizados</h3>
            <table>
                <tr>
                    <th>Mensalidade</th>
                    <th>Data do Pagamento</th>
                    <th>Valor Pago</th>
                </tr>
                ${payments?.map(payment => `
                <tr>
                    <td>${paymentTypeMap[payment.type]}</td>
                    <td>${payment.date}</td>
                    <td>${maskValue(payment.value)}</td>
                </tr>
                `).join("")}
                ${late?.map(latePayment => `
                    <tr>
                        <td>${latePayment}</td>
                        <td>Atrasado</td>
                        <td></td>
                    </tr>
                    ` || "").join("")}
                <tr>
                    <td><strong>TOTAL PAGO</strong></td>
                    <td>-</td>
                    <td><strong>${maskValue(total)}</strong></td>
                </tr>
                <tr>
                    <td><strong>Situação</strong></td>
                    <td>-</td>
                    <td><strong>${financeStatus}</strong></td>
                </tr>
            </table>
            
        </div>

        <div class="footer">
            <p>SÃO PAULO, ${today}</p>
            <br>
            <p class ="lineSign"><strong>Hugo Menezes</strong></p>
            <p>Responsável Administrativo</p>
            <p>RG: </p>
        </div>
    </div>

</body>
</html>

  `)
};

  export default alumnFinanceTemplate