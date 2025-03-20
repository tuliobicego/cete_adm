import { IAlumn } from "../../../types";

function diplomaTemplate(today: string, dateStartStr: string | null, dateEndStr: string | null, alumn: IAlumn, sign: string): string { 
    return( `
    <!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado</title>
    <style>
        * {
            padding: 10;
            box-sizing: border-box;
        }
        body {
            font-family: "Times New Roman", serif;
            display: block;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
            background-color: #f5f5f5;
        }
        .certificado-container {
            position: relative;
            width: 1200px;
            height: 850px;
            padding: 50px;
            text-align: center;
            background-image: url('moldura2.png'); /* Insira a moldura aqui */
            background-size: 100% 100%;
            background-position: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        h1 {
            font-size: 50px;
            font-weight: bold;
            margin-bottom: 10%;
            margin-top: 10%;
            text-transform: uppercase;
        }
        .texto {
            font-size: 20px;
            line-height: 1.35;
            margin: 15px 80px;
        }
        .nome-aluno {
            font-size: 40px;
            font-weight: bold;
            margin-top: 20px;
            text-transform: uppercase;
        }
        .curso {
            font-size: 34px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 15px;
        }
        .assinatura {
            margin-top: 60px;
            text-align: center;
        }
        .assinatura img {
            position: absolute; /* Faz a imagem sobrepor o texto sem deslocá-lo */
            left: 50%;
            margin: -70px auto 0 auto;
            transform: translateX(-50%); /* Centraliza horizontalmente */
            width: 180px; /* Ajuste o tamanho conforme necessário */
            height: auto;
            pointer-events: none; /* Garante que a imagem não bloqueie cliques */
        }
        .assinatura p {
            margin: 5px 0;
        }
        .assinatura strong {
            font-size: 16px;
        }
        .data {
            margin-top: 20px;
            font-size: 16px;
        }
    </style>
</head>
<body>

    <div class="certificado-container">
        <h1>CERTIFICADO</h1>
        
        <p class="texto">
            O Centro de Traumato-Ortopedia do Esporte concede o presente certificado a:
        </p>

        <p class="nome-aluno">${alumn.name}</p>

        <p class="texto">pela conclusão do curso de</p>

        <p class="curso">APRIMORAMENTO EM FISIOTERAPIA DO ESPORTE</p>

        <p class="texto">
            no período de <strong>${dateStartStr}</strong> a <strong>${dateEndStr}</strong>,
            compreendendo <strong>360</strong> horas.
        </p>

        <p class="data">
            São Paulo, ${today}
        </p>

        <div class="assinatura">
            <img src="${sign}" alt="Assinatura do Coordenador">
            <p><strong>Prof. Dr. Ronaldo Alves da Cunha</strong></p>
            <p>Coordenador de Curso</p>
        </div>
    </div>

</body>
</html>



  `)
};

  export default diplomaTemplate