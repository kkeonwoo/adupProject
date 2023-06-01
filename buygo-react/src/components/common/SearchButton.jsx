import React from 'react';
import { styled } from 'styled-components';

export default function SearchButton({ click }) {
    return <SearchBtn type='button' onClick={click}></SearchBtn>
}

const SearchBtn = styled.button`
    min-width: 70px;
    height: 50px;
    background-image: url(${require('assets/images/icons/ico_search.svg').default});
    background-position: center center;
    background-size: auto 100%;
    background-repeat: no-repeat;
`