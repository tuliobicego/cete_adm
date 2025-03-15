import { IAlumn } from "../../../types";

function declarationTemplate(today: string, dateStartStr: string | null, dateEndStr: string | null, alumn: IAlumn): string { 
    return( `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Declaração</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                padding: 0;
            }
            .container {
                max-width: 800px;
                margin: auto;
                padding: 20px;
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
            .title {
                text-align: center;
                margin-top: 100px;
                font-weight: bold;
            }
            .content {
                margin-top: 60px;
                text-align: justify;
                line-height: 1.6;
            }
            .signature {
                margin-top: 200px;
                text-align: center;
            }
            .footer {
                margin-top: 800px;
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
                  <h3>Centro de Traumato-Ortopedia do Esporte</h3>
                  <h4>Programa de Aprimoramento Profissional em Fisioterapia Esportiva</h4>
              </div>
            </div>

            <!-- Título -->
            <h2 class="title">Declaração</h2>

            <!-- Conteúdo -->
            <p class="content">
                Declaramos, para os devidos fins, que ${alumn.name}, 
                portador(a) do documento de identidade número ${alumn.documentNumber} - ${alumn.documentExpeditor}, 
                inscrito(a) no CPF sob número ${alumn.cpf}, está devidamente matriculado(a) no 
                curso de Aprimoramento Profissional em Fisioterapia Esportiva, oferecido por esta instituição.
            </p>
            <p class="content">
                O curso teve início no ${dateStartStr?.toLowerCase()} e tem previsão de término em ${dateEndStr?.toLowerCase()}.
            </p>

            <!-- Assinatura -->
            <div class="signature">
                <p>São Paulo, ${today}</p>
                <br><br>
                <img src="check-circle.svg" alt="Assinatura">
                <p>Prof. Ronaldo Alves da Cunha</p>
                <p>Crefito3-87842-F</p>
            </div>

            <!-- Rodapé -->
            <div class="footer">
                <p>Centro de Traumato-Ortopedia do Esporte, CNPJ 03145227000113</p>
                <p>Endereço: Rua Estado de Israel, 715, Vila Clementino, São Paulo, SP.</p>
                <p>Contato: (11) 93120-501 | contato@cursoscete.com.br</p>
            </div>
        </div>
    </body>
    </html>
  `)
};

  export default declarationTemplate