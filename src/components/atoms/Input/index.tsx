import React, { useState } from "react";
import { Container, InputBox } from "./styles"; // Assumindo que há estilos definidos
import { applyMask, formatName } from "../../../utils/masks/masks";
import IconButton from "../IconButton";
import { FaAccessibleIcon } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  initialValue?: string;
  label?: string;
  icon?: React.ElementType;
  sendButton?: boolean;
  iconSendButton?: React.ComponentType;
  onSendButton?(): void
  maskType?: "name" | "cpf" | "cnpj" | "phoneNumber" | "cep" | "data" | 'grade' | 'value' | 'number' | 'year' | "custom";
  customMask?: string; // Permite uma máscara personalizada
}

const Input: React.FC<InputProps> = ({ sendButton, iconSendButton: SendButton, initialValue, label, icon: Icon, maskType, customMask, onChange, onSendButton, ...rest }) => {
  const [value, setValue] = useState(initialValue || "");

  // 🔹 Define os limites de caracteres para cada máscara
  const maxLengths: Record<string, number> = {
    cpf: 14, // 000.000.000-00
    cnpj: 18, // 00.000.000/0000-00
    phoneNumber: 15, // (00) 00000-0000
    cep: 9, // 00000-000
    data: 10, // 00/00/0000
    grade: 5,
    custom: customMask ? customMask.replace(/\D/g, "").length : 100, // Limite baseado na máscara personalizada
    name: 100,
    value: 10,
    number: 5,
    year: 4
  };

  // 🔹 Função para aplicar máscaras usando RegEx
  

  // 🔹 Manipulador de Mudança (onChange)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if(maskType) {
      const maskedValue = maskType === 'name' ? formatName(rawValue) : applyMask(rawValue, maskType)
      setValue(maskedValue);
    } else {
      setValue(rawValue)
    }
    
    if(onChange) {
      onChange(event)
    }
  };



  return  maskType ? (
    <Container>
      {label && <h1 style={{ fontSize: "12px" }}>{label}</h1>}
      <InputBox>
        {Icon && <Icon size={25} color="#2d76b2" />}
        <input 
          {...rest} 
          value={value} 
          onChange={handleChange} 
          maxLength={maskType ? maxLengths[maskType] : 100} // Limite de caracteres
        />
      </InputBox>
    </Container>
  ) : <Container>
  {label && <h1 style={{ fontSize: "12px" }}>{label}</h1>}
  <InputBox style={{background: sendButton ? '#e6e6e6bb' : "#ffffff"}}>
    {Icon && <Icon size={25} color="#2d76b2" />}
    <input 
      {...rest} 
      onChange={onChange} 
      maxLength={maskType ? maxLengths[maskType] : 100} // Limite de caracteres
    />
    {sendButton && onSendButton && SendButton ?
            <IconButton
              name={"enviar"}
              label={"enviar"}
              onPress={onSendButton}
              icon={SendButton}
            />
  : null}
  </InputBox>
  
</Container>;
};

export default Input;
