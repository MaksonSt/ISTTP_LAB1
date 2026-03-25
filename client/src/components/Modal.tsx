import { useEffect, type ReactNode } from 'react'
import styled from 'styled-components'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>
        <Body>{children}</Body>
      </Box>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`

const Box = styled.div`
  background: #1a1a2e;
  border: 1px solid #2a2a4a;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #2a2a4a;
`

const ModalTitle = styled.h2`
  font-size: 17px;
  color: #fff;
  margin: 0;
  font-weight: 600;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  &:hover { color: #fff; }
`

const Body = styled.div`
  padding: 20px 24px 24px;
`

export const Field = styled.div`
  margin-bottom: 16px;
`

export const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const Input = styled.input`
  width: 100%;
  background: #0f0f1a;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #e0e0e0;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #4fc3f7; }
`

export const Select = styled.select`
  width: 100%;
  background: #0f0f1a;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #e0e0e0;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  &:focus { border-color: #4fc3f7; }
  option { background: #1a1a2e; }
`

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #2a2a4a;
`

export const BtnPrimary = styled.button`
  background: #4fc3f7;
  color: #0f0f1a;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #81d4fa; }
`

export const BtnSecondary = styled.button`
  background: transparent;
  color: #888;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  &:hover { color: #fff; border-color: #444; }
`
