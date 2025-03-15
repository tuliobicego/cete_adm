import { stringToDateRed } from "../date/date";
import { removeMask } from "../masks/masks";

function emailVerifier(value: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
}

function hourVerifier(value: string) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

function zeroToTen(value: string) {
  return /^([0-9]|10)$/.test(value);
}


function isValid (value: string, type: string): boolean {
  value = removeMask(value, type);

  switch (type) {
      case "cpf":
          return value.length === 11; // Apenas verifica o tamanho (pode ser melhorado)

      case "cnpj":
          return value.length === 14;

      case "phoneNumber":
          return value.length === 11; // Deve ter 11 dígitos (com DDD)

      case "cep":
          return value.length === 8;

      case "year":
          return value.length === 4

      case "data":
          return /^\d{8}$/.test(value); // Deve ter 8 números (DDMMAAAA)

      case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // RegEx para validar e-mail

      default:
          return true;
  }
};

function getMissingMonths(startDate: string, dataList: string[]): string[] {
  
  const today = new Date();
  const months: string[] = [];

  // Criador de formato para os meses em português
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: "long" });

  // Gera todos os meses desde a data inicial até o mês atual
  let current = stringToDateRed(startDate);
  let i = 0
  while (current <= today && i < 12) {
    const monthName = monthFormatter.format(current);
    months.push(monthName);
    current.setMonth(current.getMonth() + 1); // Avança um mês
    i++
  }

  // Cria um Set com os meses registrados (em extenso)
  const registeredMonths = new Set(dataList);

  // Filtra os meses que não estão presentes na lista de registros
  return months.filter((month) => !registeredMonths.has(month));
}

export { emailVerifier, hourVerifier, zeroToTen, isValid, getMissingMonths};
