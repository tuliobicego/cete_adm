import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs, { Dayjs } from "dayjs";

export const dateToString = (date: Date) => {
  return format(date, "'Dia' dd 'de' MMMM' de 'yyyy', às ' HH:mm'h'", {
    locale: ptBR,
  });
};

export const dateToStringRed = (date: Date | undefined) => {
  if(!date) return ""
  return format(date, "'Dia' dd 'de' MMMM' de 'yyyy'", {
    locale: ptBR,
  });
};

export const stringToDate = (str: string) => {
  return parse(
    str,
    "'Dia' dd 'de' MMMM' de 'yyyy', às ' HH:mm'h'",
    new Date(),
    { locale: ptBR }
  );
};


export const stringToDateRed = (str: string) => {
  return parse(
    str,
    "'Dia' dd 'de' MMMM' de 'yyyy'",
    new Date(),
    { locale: ptBR }
  );
};

export const stringToDay = (str: string) => {
  const date = parse(
    str,
    "'Dia' dd 'de' MMMM' de 'yyyy', às ' HH:mm'h'",
    new Date(),
    { locale: ptBR }
  );
  return format(date, "yyyy'-'MM'-'dd", { locale: ptBR });
};

export const stringToHour = (str: string) => {
  const date = parse(
    str,
    "'Dia' dd 'de' MMMM' de 'yyyy', às ' HH:mm'h'",
    new Date(),
    { locale: ptBR }
  );
  return format(date, "HH'-'mm", { locale: ptBR });
};

export const transformDate = (str: string) => {
  const date = parse(str, "'Dia' dd 'de' MMMM' de 'yyyy'", new Date(), {
    locale: ptBR,
  });
  return format(date, "yyyy'-'MM'-'dd", { locale: ptBR });
};

export const transformDateBr = (str: string) => {
  const date = parse(str, "'Dia' dd 'de' MMMM' de 'yyyy'", new Date(), {
    locale: ptBR,
  });
  return format(date, "dd'/'MM'/'yyyy", { locale: ptBR });
};

export const transformDateNoLocale = (str: string) => {
  const date = parse(str, "'Dia' dd 'de' MMMM' de 'yyyy'", new Date());
  return format(date, "yyyy'-'MM'-'dd");
};

export const dayHourToDate = (day: string, hour: string) => {
  const date = new Date(
    Number(day.slice(6)),
    Number(day.slice(3, 5)) - 1,
    Number(day.slice(0, 2)),
    Number(hour.slice(0, 2)),
    Number(hour.slice(3, 5))
  );
  return date;
};

export const transformFullDatePicker = (day: Dayjs | undefined): string => {
  if (day) return day.format('[Dia] DD [de] MMMM [de] YYYY[,] [às]  HH[:]mm[h]');
  else return ''
};


export const transformDatePicker = (day: Dayjs | undefined): string => {
  if (day) return day.format('[Dia] DD [de] MMMM [de] YYYY');
  else return ''
};


export const revertDatePicker = (day: string | undefined, pos: string ) => {

  
  if(day && pos === 'start') {
    const dayDate = parse(
      day,
      "'Dia' dd 'de' MMMM' de 'yyyy'",
      new Date(),
      { locale: ptBR }
    );
    return dayjs(dayDate).hour(1).minute(0).second(0);
  }
  if(day && pos === 'end') {
    const dayDate = parse(
      day,
      "'Dia' dd 'de' MMMM' de 'yyyy'",
      new Date(),
      { locale: ptBR }
    );
    return dayjs(dayDate).hour(23).minute(0).second(0);
  } 
};
export const revertFullDatePicker = (day: string | undefined ) => {

  
  if(day) {
    const dayDate = parse(
      day,
      "'Dia' dd 'de' MMMM' de 'yyyy', às ' HH:mm'h'",
      new Date(),
      { locale: ptBR }
    );
    return dayjs(dayDate);
  }
};

export const ptBRLocale = {
  lang: {
    locale: "pt_BR",
    placeholder: ["Data inicial", "Data final"],
    rangePlaceholder: ["Início", "Fim"],
    today: "Hoje",
    now: "Agora",
    backToToday: "Voltar para hoje",
    ok: "OK",
    clear: "Limpar",
    month: "Mês",
    year: "Ano",
  },
  timePickerLocale: {
    placeholder: "Selecionar horário",
  },
}
