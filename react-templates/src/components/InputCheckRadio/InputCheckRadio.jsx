import React from 'react';
import styled, { css } from 'styled-components';

export default function InputCheckRadio({ id, name, type, children}) {
  return (
    <InputLabel htmlFor={id}>
      <InputCheck id={id} type={type} name={name} />
      <InputCheckTxt type={type}>{children}</InputCheckTxt>
    </InputLabel>
  );
}

const InputLabel = styled.label`
  display: inline-flex;
  align-content: center;
`

const InputCheck = styled.input`
  appearance: none;
  
  &:checked::before {
    background-position: left bottom;
  }
`

const InputCheckTxt = styled.span`
  display: flex;
  align-items: center;
  font-size: 11px;
  line-height: 1.636363;
  color: #727272;
  user-select: none;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;

  ${(props) => {
    switch (props.type) {
      case 'checkbox':
        return css`
          &::before {
            border-radius: 3px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='40' viewBox='0 0 20 40' fill='none'%3E%3Crect x='1' y='21' width='18' height='18' rx='3' fill='%23727272' stroke='%23727272' stroke-width='0.7'/%3E%3Cpath d='M14.2901 26.2551C14.4802 26.0897 14.7332 25.9982 14.9956 26C15.2581 26.0018 15.5095 26.0968 15.6968 26.2648C15.8841 26.4328 15.9927 26.6608 15.9996 26.9005C16.0066 27.1403 15.9113 27.3732 15.734 27.5501L10.3499 33.7044C10.2573 33.7955 10.1456 33.8686 10.0214 33.9194C9.89718 33.9702 9.76304 33.9975 9.62699 33.9998C9.49095 34.0021 9.35579 33.9793 9.22961 33.9328C9.10342 33.8863 8.9888 33.817 8.89259 33.729L5.32211 30.4656C5.22268 30.381 5.14293 30.2788 5.08761 30.1654C5.0323 30.0519 5.00256 29.9294 5.00016 29.8052C4.99776 29.681 5.02276 29.5577 5.07366 29.4425C5.12456 29.3273 5.20032 29.2227 5.29642 29.1348C5.39252 29.047 5.507 28.9778 5.63301 28.9312C5.75903 28.8847 5.89401 28.8619 6.02989 28.8641C6.16578 28.8662 6.29979 28.8934 6.42394 28.944C6.54808 28.9945 6.65981 29.0674 6.75246 29.1583L9.57808 31.7397L14.2645 26.2822C14.2729 26.2727 14.2819 26.2636 14.2915 26.2551H14.2901Z' fill='white'/%3E%3Crect x='1' y='1' width='18' height='18' rx='3' fill='white' stroke='%23727272' stroke-width='0.7'/%3E%3C/svg%3E"); 
            background-position: left top;
            background-size: 100% auto;
            background-repeat: no-repeat;
          }

          ${InputCheck}:focus ~ &:before {
            outline: 2px solid rgba(0, 0, 0, .5);
          }
        `
      case 'radio':
        return css`
          &::before {
            background: url(/images/icons/ico_radio.svg) no-repeat center top / 100% auto;
            outline:none;
            vertical-align: top; 
          }
        `
      default:
        break;
    }
  }}

  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  ${InputCheck}:checked ~ &::before {
    background-position: left bottom;
  }
`