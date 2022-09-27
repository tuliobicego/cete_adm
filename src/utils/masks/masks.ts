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
  // (11)1111-1111
  value = value.replace(/^(\d{2})(\d)/g, "($1)$2");
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

export { maskName, maskCep, maskPhone, maskCpf, maskDay, maskHour, maskNumber };
