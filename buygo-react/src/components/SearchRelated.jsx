import React, { useEffect, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import uuid from 'react-uuid';

export default function SearchRelated({ text }) {
    const relatedText = text;
    const navigate = useNavigate();
    const { isLoading, error, data: relatedSearch } = useQuery(['relatedSearch', relatedText], async () => {
        if (relatedText.length === 0) {
            return false;
        }
        return axios.get('/data/buygo_product.json')
        .then((res) => res.data)
        .then((items) => items.filter((item) => {
                return item.product.toLowerCase().includes(relatedText);
        }))
    })
    const handleLink = (item) => {
        const params = item.product.toLowerCase();
        navigate(`/result/${params}`)
    }
    
    return (
        <DropdownArea className={relatedText ? 'active' : ''}>
            { isLoading && <MsgText>is Loading... 👀</MsgText>}
            { error && <MsgText>error 🤢</MsgText>}
            { relatedSearch && <MsgText>No matching search terms ❌</MsgText>}
            <ul>
                { relatedSearch && relatedSearch.map((item, idx) => {
                    return <li key={uuid()} onClick={(e) => handleLink(item)}>
                        <DropdownText>{item.product}</DropdownText>
                    </li>
                })}
            </ul>
        </DropdownArea>
    );
}

const DropdownArea = styled.div`
    display: none;
    position: absolute;
    overflow-y: auto;
    top: calc(100% + 1px);
    left: 200px;
    width: 456px;
    min-height: 490px;
    border: 1px solid ${({theme}) => theme.lightMode.danger };
    background-color: ${({theme}) => theme.lightMode.white };
    z-index: 10;

    &.active {
        display: block;
    }
`

const DropdownText = styled.span`
    display: block;
    padding: 12px;
    font-size: 17px;
    line-height: 1.2;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`

const MsgText = styled.p`
    padding: 12px;
    font-size: 17px;
    line-height: 1.2;
`