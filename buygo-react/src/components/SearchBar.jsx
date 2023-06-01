import React, { useState } from 'react';
import SearchButton from 'components/common/SearchButton';
import Select from 'components/common/Select';

import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [ text, setText ] = useState('');
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate(`/result/${text}`);
    }
    const handleClick = (e) => {
        e.preventDefault();

        setText('');
        handleSubmit();
    }
    const handleChange = (e) => setText(e.target.value);

    return (
        <SearchContainer onSubmit={handleSubmit}>
            <SelectBox>
                <Select optionData={['전체', '면류/즉석식품', '스낵', '커피/음료/건강식품', '식자재', '신선식품', '냉장/냉동식품', '선물세트', '생활잡화', 'MRO']}/>
            </SelectBox>
            <SearchInput type="text" value={text} onChange={handleChange} placeholder='검색어나 상품코드를 입력하세요.' />
            <SearchButton click={handleClick} />
        </SearchContainer>
    );
}

const SearchContainer = styled.form`
    display: flex;
    width: 680px;
    margin-left: 20px;
    border: 2px solid ${({theme}) => theme.lightMode.danger };
    border-radius: 100px;
`

const SelectBox = styled.div`
    position: relative;
    &::after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 40px;
        transform: translateY(-50%);
        background-color: ${({theme}) => theme.lightMode.danger };
    }
`

const SearchInput = styled.input`
    width: 100%;
    height: 50px;
    padding: 0 20px;
    border: none;
    background-color: transparent;
    font-size: 20px;
    outline: none;

    &::placeholder { 
        font-size: 20px;
        color: ${({theme}) => theme.lightMode.gray500};
    }
`