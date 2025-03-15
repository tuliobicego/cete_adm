export const monthMap = {
  "01": "janeiro",
  "02": "fevereiro",
  "03": "março",
  "04": "abril",
  "05": "maio",
  "06": "junho",
  "07": "julho",
  "08": "agosto",
  "09": "setembro",
  "10": "outubro",
  "11": "novembro",
  "12": "dezembro",
};

export function monthMapF(mes: string | string[]): string {
  if(mes === "01") return "jameiro" 
  if(mes === "02") return "fevereiro" 
  if(mes === "03") return "março" 
  if(mes === "04") return "abril" 
  if(mes === "05") return "maio" 
  if(mes === "06") return "junho" 
  if(mes === "07") return "julho" 
  if(mes === "08") return "agosto" 
  if(mes === "09") return "setembro" 
  if(mes === "10") return "outubro" 
  if(mes === "11") return "novembro" 
  return "dezembro" 
};

export const lessonPeriodMap = {
  "morning": "Manhã",
  "afternoon": "Tarde",
  "":""
}
