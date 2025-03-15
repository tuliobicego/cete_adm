
function formatName(value: string): string {
  const lowercaseWords = new Set(["de", "da", "do", "das", "dos", "e"]);
  return value
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (lowercaseWords.has(word) && index !== 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function maskName(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1-$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
}

function maskCep(value: string) {
  value = value.replace(/\D/g, ""); // 1239856
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  return value;
}

function maskPhone(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}

function maskNumber(value: string) {
  value = value.replace(/\D/g, "");
  return value;
}

function maskCpf(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1-$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
}

function maskDay(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{4})$/, "$1/$2");
  value = value.replace(/(?=(\d{2})+(\D))\B/g, "/");
  return value;
}

function maskHour(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1:$2");
  return value;
}

function maskValue(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d+)(\d{2})$/, "R$ $1,$2");
  return value;
}

function maskGrade(value: string): string {
  // 🔹 Remove tudo que não for número
  const intValue = parseInt(value)
  if(intValue === 1000) return '10,0' 
  else if (intValue > 1000) {value = value.slice(0,-1)}

  // 🔹 Se tiver mais de dois dígitos, verifica se o número antes do último dígito é maior que 10
  if (value.length > 3) {
      value = value.slice(-1,0).replace(/(\d{1})(\d{2})$/, "$1,$2");    
  } else if (value.length > 2) {
    value = value.replace(/(\d{1})(\d{2})$/, "$1,$2");
  } else if (value.length > 1) {
    value = value.replace(/(\d{1})(\d{1})$/, "$1,$2");
  }

  return value;
}



function removeMask(value: string, type: string): string {
  if (!value) return "";
  
  switch (type) {
      case "email":
          return value.trim(); // Apenas remove espaços extras

      case "cpf":
      case "cnpj":
      case "phoneNumber":
        return value = value.replace(/\D/g, "");
      case "cep":
      case "name": 
        return value.trim().toLowerCase()
      case "data":
          return value.replace(/\D/g, ""); // Remove tudo que não for número
      case "value":
        return value.replace(/\D/g, "")

      default:
          return value;
  }
};



function applyMask (value: string, type: string, customMask?): string  {
  value = value.replace(/\D/g, ""); // Remove tudo que não for número

  switch (type) {
    case 'number':
      return value
    case 'year':
      return value
    case "value":
      return value.replace(/\D/g, "")
              .replace(/(\d+)(\d{2})$/, "R$ $1,$2");
    case "cpf":
      return value
        .slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    case "cnpj":
      return value
        .slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");

    case "phoneNumber":
      return value
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");

    case "cep":
      return value.slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");

    case "data":
      return value.slice(0, 8).replace(/^(\d{2})(\d)/, "$1/$2").replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

    case "grade":
      return maskGrade(value);

    case "custom":
      if (customMask) {
        let maskedValue = "";
        let index = 0;
        for (let i = 0; i < customMask.length; i++) {
          if (customMask[i] === "9" && index < value.length) {
            maskedValue += value[index];
            index++;
          } else if (index < value.length) {
            maskedValue += customMask[i];
          }
        }
        return maskedValue;
      }
      return value;

    default:
      return value;
  }
};


export { maskName, maskCep, maskPhone, maskCpf, maskDay, maskHour, maskNumber, maskValue, removeMask, applyMask, maskGrade, formatName};
