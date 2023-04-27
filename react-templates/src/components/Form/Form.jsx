import React from 'react';
import styled, { css } from 'styled-components';

export default function Form(props) {
  const { w=100, column=false, disabled=false, inputGroup=false, inputGroupTxt, label, placeHolder } = props;
  return (
    <>
      <FormLabel w={w} column={column}>
        <FormTxt>{ label }</FormTxt>
        { inputGroup ? 
        <InputGroup inputGroup={inputGroup}>
          <InputGroupTxt>{inputGroupTxt}</InputGroupTxt>
          <InputControl disabled={disabled} type="text" placeholder={placeHolder}/>
        </InputGroup>
        : <InputControl disabled={disabled} type="text" placeholder={placeHolder}/>
        }
      </FormLabel>
    </>
  );
}

const FormLabel = styled.label`
  display: inline-flex;
  align-items: center;
  width: ${props => `${props.w}%`};
  gap: 10px;
  user-select: none;
  ${props => props.column && css`
    flex-direction: column;
    align-items: start;
  `}
`

const FormTxt = styled.span`
  display: inline-block;
  width: 110px;
  min-width: 110px;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: #363636;
  word-break: break-all;
`

const InputControl = styled.input`
  width: 100%;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc; 
  
  &:focus {
    border-color: ${props => props.theme.colors.focusColor};
  }

  &::placeholder {
    transition: all .25s ease;
  }

  &:focus::placeholder {
    transform: translate(0.2em);
  }

  ${props => props.disabled && css`
    &:disabled,
    &:read-only {
      background-color: #eee;
      cursor: not-allowed;
    }
  `}
`

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;

  ${props => props.inputGroup && css`
    ${InputGroupTxt} {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    ${InputControl} {
      width: auto;
      flex: 1;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  `}
`

const InputGroupTxt = styled.span`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1.25;
  color: #666;
  text-align: center;
  white-space: nowrap;
`