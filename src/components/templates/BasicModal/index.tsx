import React from 'react'
import { Container } from './styles'
import { Modal } from 'antd';

type Props = {
  children?: React.ReactNode
  text: string
  onCancel(): void 
  visible: boolean
};

const BasicModal: React.FC<Props> = ({children, text, onCancel, visible}) => {
  return (
    <Modal
        title={text}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        children={children}
      />
  )
}

export default BasicModal