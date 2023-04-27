import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import uuid from 'react-uuid';

export default function Select({ optionData }) {
  const [ showOption, setShowOption] = useState(null);
  const [ saveValue, setSaveValue] = useState(0);
  const [ selected, setSelected] = useState(false);
  const [ currentValue, setCurrentValue] = useState(optionData[0]);
  const [ countOption, setCountOption ] = useState(0);
  const wrapperRef = useRef(null);
  const useOutsideClose = (ref) => {
    useEffect(() => {
      function handleClickOutside (e) {
        if (ref.current && !ref.current.contains(e.target)) {
          setShowOption(false);
        }
      }
      return () => {
        document.addEventListener('click', handleClickOutside);
      }
    },[ref])
  }
  const handleValue = (e, idx) => {
    let value = e.target.innerText;

    setShowOption(false);
    setSaveValue(idx);
    setSelected(true);
    setCurrentValue(value);
  }
  const handleKeyboardValue = (e) => {
    e.preventDefault();
    let max = optionData.length - 1;
    if (e.keyCode === 40) {
      if ( countOption < max) {
        setCountOption(prev => prev + 1);
      }
    }
    if (e.keyCode === 38) {
      if ( countOption > 0) {
        setCountOption(prev => prev - 1);
        setCurrentValue(optionData[countOption]);
      }
    }
    if (e.keyCode === 13) {
      setShowOption((prev) => !prev)
    }
    setCurrentValue(optionData[countOption]);
    setSaveValue(countOption);
    setSelected(true);
  }
  useOutsideClose(wrapperRef);
  return (
    <FormSelect ref={wrapperRef} className={showOption && 'active'}>
      <FormBtn onClick={() => setShowOption((prev) => !prev)} onKeyDown={(e) => handleKeyboardValue(e)} className={selected && 'active'}>{currentValue}</FormBtn>
      <OptionArea className={showOption && 'active'}>
        <ul>
          { optionData.map((option, idx) => {
            return (
              <OptionItem key={uuid()} className={saveValue === idx ? 'active' : ''}>
                <OptionButton onClick={(e) => handleValue(e, idx)}>{option}</OptionButton>
              </OptionItem>
            )
          })}
        </ul>
      </OptionArea>
    </FormSelect>
  );
}

const FormSelect = styled.div`
  position: relative;

  &.active button:after {
  transform: translateY(-50%) rotate(180deg);
  background-color: red;
}
`

const FormBtn = styled.button`
display: block;
overflow: hidden;
width: 100%;
padding: 13px;
padding-right: calc(13px * 2 + 14px);
border-radius: 4px;
background-color: #fff;
box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
font-size: 14px;
line-height: 1.285714;
color: #D4D4D4;
text-align: left;
text-overflow: ellipsis;
white-space: nowrap; 
outline: none;

&.active {
  color: #191919;
}

&::after {
  content: '';
  display: block;
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 10px;
  background-position: center center;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-color: #191919;
  pointer-events: none;
  transition: transform .45s;
}

&:focus {
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.55);
}
`

const OptionArea = styled.div`
  display: none;
  position: absolute;
  z-index: 99999;
  left: 0;
  overflow-y: auto;
  transform: translateY(10px);
  width: 100%;
  max-height: 250px;
  padding: 7px 0;
  border-radius: 4px;
  background-color: #FFFFFF; 
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

  &.active {
    display: block;
  }
`

const OptionItem = styled.li`
  &:hover button {
    background-color: #fafafa;
  }

  &.active button {
    background-color: #eee;
  }
`

const OptionButton = styled.button`
  display: flex;
  width: 100%;
  padding: 6px 13px;
  font-size: 14px;
  line-height: 1.285714;
  text-align: left;
`