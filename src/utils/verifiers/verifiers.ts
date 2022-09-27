function emailVerifier(value: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
}

function hourVerifier(value: string) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
}

function zeroToTen(value: string) {
  return /^([0-9]|10)$/.test(value);
}

export { emailVerifier, hourVerifier, zeroToTen };
