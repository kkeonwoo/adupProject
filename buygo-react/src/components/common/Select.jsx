import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import uuid from 'react-uuid';

export default function Select({ optionData }) {
    const [ isOpen, setIsOpen] = useState(null);
    const [ saveValue, setSaveValue] = useState(0);
    const [ selected, setSelected] = useState(false);
    const [ currentValue, setCurrentValue] = useState(optionData[0]);
    const wrapperRef = useRef(null);

    const handleValue = (e, idx) => {
        let value = e.target.innerText;

        setIsOpen(false);
        setSaveValue(idx);
        setSelected(true);
        setCurrentValue(value);
    }

    const useOutsideClose = (ref) => {
        useEffect(() => {
        function handleClickOutside (e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        return () => {
            document.addEventListener('click', handleClickOutside);
        }
        },[ref])
    }
    useOutsideClose(wrapperRef);

    return (
        <FormSelect ref={wrapperRef} className={isOpen && 'active'}>
            <FormBtn 
                type='button'
                onClick={() => setIsOpen((prev) => !prev)}
                className={selected && 'active'}
            >
                {currentValue}
            </FormBtn>
            <OptionArea className={isOpen && 'active'}>
                <ul>
                    { optionData && optionData.map((option, idx) => {
                        return (
                        <OptionItem 
                            id={idx}
                            key={uuid()}
                            className={saveValue === idx ? 'active' : ''}
                        >
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
    width: 200px;

    &.active button:after {
    transform: translateY(-50%) rotate(180deg);
}
`

const FormBtn = styled.button`
    display: block;
    overflow: hidden;
    width: 100%;
    height: 50px;
    padding: 0 40px;
    font-size: 20px;
    color: ${({theme}) => theme.lightMode.danger };
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap; 
    outline: none;

    /* &.active {
        color: #191919;
    } */

    &::after {
        content: '';
        display: block;
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 10px;
        background-image: url(${require('assets/images/icons/arw_down_red_sm.svg').default});
        background-position: center center;
        background-size: 100% auto;
        background-repeat: no-repeat;
        pointer-events: none;
        transition: transform .45s;
    }
`

const OptionArea = styled.div`
    display: none;
    position: absolute;
    z-index: 99999;
    top: calc(100% + 1px);
    right: 0;
    overflow-y: auto;
    width: 175px;
    max-height: 500px;
    border: 1px solid ${({theme}) => theme.lightMode.danger };
    background-color: ${({theme}) => theme.lightMode.white }; 

    &.active {
        display: block;
    }
`

const OptionItem = styled.li`
  &:hover button {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.active button {
    color: ${({theme}) => theme.lightMode.danger };
  }
`

const OptionButton = styled.button`
  display: flex;
  width: 100%;
  padding: 12px;
  font-size: 17px;
  line-height: 1.2;
  text-align: left;
`