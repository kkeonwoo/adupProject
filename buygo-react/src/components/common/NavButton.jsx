import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export default function NavButton({ link, children }) {
    return (
        <LinkBtn to={link} data-text={children}>{ children }</LinkBtn>
    );
}

const LinkBtn = styled(Link)`
    font-size: 21px;
    color: ${({theme}) => theme.lightMode.white };

    &:hover {
        font-weight: 700;
    }

    &::after {
        content: attr(data-text);
        display: block;
        font-weight: 700;
        height: 0px;
        visibility: hidden;
    }
`