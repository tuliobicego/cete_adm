import { IAlumn } from "../../../types";
import { alumnStatusMap } from "../../../utils/maps/status";

function historyTemplate(today: string, dateStartStr: string | null, dateEndStr: string | null, alumn: IAlumn, sign: string): string { 
    return( `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Histórico de Aprimoramento</title>
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
            margin-bottom: 5%;
            margin-top: 5%;
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
            margin-top: 10%; /* Mantém o rodapé sempre no final */
            align-self: center;
        }
        .footer img {
            position: absolute; /* Faz a imagem sobrepor o texto sem deslocá-lo */
            left: 50%;
            margin: -10px auto 0 auto;
            transform: translateX(-50%); /* Centraliza horizontalmente */
            width: 180px; /* Ajuste o tamanho conforme necessário */
            height: auto;
            pointer-events: none; /* Garante que a imagem não bloqueie cliques */
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
        .data-field {
            font-weight: bold;
        }
        .info {
            margin-top: 300px;
            font-size: 12px;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 10px;
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

        <h2>HISTÓRICO ESCOLAR</h2>
        
        <p><strong>Curso:</strong> APRIMORAMENTO PROFISSIONAL EM FISIOTERAPIA ESPORTIVA</p>
        <p><strong>Aluno(a):</strong> ${alumn.name}</p>

        <p>
            <strong>E-mail:</strong> ${alumn.email} |
            <strong>Nacionalidade:</strong> brasileira |
            <strong>Data de Nascimento:</strong> ${alumn.birthDate}
        </p>

        <p>
            <strong>Documento:</strong> ${alumn.documentNumber} |
            <strong>Órgão Emissor:</strong> ${alumn.documentExpeditor} |
            <strong>CPF:</strong> ${alumn.cpf}
        </p>

        <p>
            <strong>Ensino Superior:</strong> ${alumn.diplomaUniversity} |
            <strong>Ano de Conclusão:</strong> ${alumn.diplomaYear}
        </p>

        <h3>Disciplinas Cursadas</h3>
        <table>
            <tr>
                <th>Módulo</th>
                <th>Carga Horária</th>
                <th>% de Frequência</th>
                <th>Nota Final</th>
            </tr>
            
            <tr>
                <td>LESÕES NOS ESPORTES</td>
                <td>50</td>
                <td>${alumn.frequences?.[0] || '---'}</td>
                <td>${alumn.grades?.[0]}</td>
            </tr>
            
            <tr>
                <td>AVALIAÇÃO NO ESPORTE E PRONTO ATENDIMENTO</td>
                <td>50</td>
                <td>${alumn.frequences?.[1] || '---'}</td>
                <td>${alumn.grades?.[1]}</td>
            </tr>
            
            <tr>
                <td>REABILITAÇÃO DAS LESÕES ESPORTIVAS</td>
                <td>60</td>
                <td>${alumn.frequences?.[2] || '---'}</td>
                <td>${alumn.grades?.[2]}</td>
            </tr>
            
            <tr>
                <td>RECURSOS TERAPÊUTICOS E TÓPICOS COMPLEMENTARES</td>
                <td>80</td>
                <td>${alumn.frequences?.[3] || '---'}</td>
                <td>${alumn.grades?.[3]}</td>
            </tr>
            
            <tr>
                <td>DISCIPLINA TRANVERSAL (Optativo)</td>
                <td>120</td>
                <td>${alumn.frequences?.[4] || '---'}</td>
                <td>${alumn.grades?.[4] || '---'}</td>
            </tr>
        </table>

        <h3>Sistema de Avaliação</h3>
        <p>Será aprovado o aluno que, atendida à frequência mínima de 75% da carga horária do módulo, obtiver como média final do processo avaliativo nota igual ou superior a 7,0 (sete) pontos, ou conceito equivalente.</p>

        <h3>Período de Realização do Curso</h3>
        <p><strong>Início:</strong> ${dateStartStr?.toLowerCase()} | <strong>Término:</strong> ${dateEndStr?.toLowerCase()}</p>

        <h3>Situação do Aluno</h3>
        <p>${alumnStatusMap[alumn.status]}</p>

        <h3>Carga Horária Total</h3>
        <p>360 HORAS</p>

        <div class="footer">
            <p>São Paulo, ${today}</p>
            <br>
            <img src="${sign}" alt="Assinatura do Coordenador">
            <p class="lineSign"><strong>Prof. Dr Ronaldo Alves da Cunha</strong></p>
            <p>Coordenador de Curso</p>
        </div>
        <div class="info">
            <p>Centro de Traumato-Ortopedia do Esporte, CNPJ 03145227000113</p>
            <p>Endereço: Rua Estado de Israel, 715, Vila Clementino, São Paulo, SP.</p>
            <p>Contato: (11) 93120-501 | contato@cursoscete.com.br</p>
        </div>
    </div>

</body>
</html>

  `)
};

  export default historyTemplate