import React from 'react'
import { Drop } from "./styles"


interface SelectProps {
  options: {key: string, value: string}[]
  onSelect(value: string): void
}

const Select: React.FC<SelectProps> = ({options, onSelect}) => {
  return (
    <Drop onChange={(e) => onSelect(e.target.value)}>
      {options.map((option) => {
        return <option key={`${option.key}`} value={option.key}>{option.value}</option>
      })}
    </Drop>
  )
}

export default Select