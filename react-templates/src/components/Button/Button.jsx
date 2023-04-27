import React from 'react';
import styled, { css } from 'styled-components';

const CustomButton = (props) => {
  const { color, disabled, invert, children, roundPill = false, onClick} = props;
  return (
    <Btns color={color} disabled={disabled} invert={invert} roundPill={roundPill} onClick={onClick}>{children}</Btns>
  );
}

const Btns = styled.button`
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    min-width: 100px;
    font-weight: 400;
    line-height: 1.53;
    border: 1px solid transparent;
    padding: 10px;
    font-size: 16px;
    border-radius: ${props => props.roundPill ? '50rem' : '6px'};
    transition: all .2s ease-in-out;
    user-select: none;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
    color: ${props => props.color && !props.invert ? '#fff' : props.theme.colors.primary};

    &:hover, &:focus {
      transform: translateY(-1px);
    }

    ${props => props.disabled && css`
      cursor: not-allowed;
      opacity: 0.65;
      &:hover, &:focus {
        transform: translateY(0);
      }
    `} // disabled button

    ${props => {
      if(props.invert) return false;
      switch (props.color) {
        case 'primary':
          return css`
            background: ${props.theme.colors.primary};
          `
        case 'secondary':
          return css`
            background: ${props.theme.colors.secondary};
          `
        default: return css`
          background: transparent;
        `
      }
    }} // button color

    ${props => {
      if(!props.invert) return false;
      switch (props.color) {
        case 'primary':
          return css`
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
          `
        case 'secondary':
          return css`
            border-color: ${props.theme.colors.secondary};
            color: ${props.theme.colors.secondary};
          `
        default:
          break;
      }
    }} // invert button
  `

  export default CustomButton;