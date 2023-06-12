import React from 'react';
// import NavDepth02 from './NavDepth02';

import { useQuery } from '@tanstack/react-query';
import { styled } from 'styled-components';
import axios from 'axios';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';

export default function NavDepth01() {
    const { data: category } = useQuery(['category'], async () => {
        return axios.get('/data/buygo_product.json')
        .then((res) => res.data)
        .then((items) => items.map((item) => {
                return item.category;
        }))
    })

    // const categoryArray = category && category.map((category) => {
    //     return category.category
    // })

    // const subCategoryArray = category.map((category) => {
    //     return category.subdivision
    // })
    
    return (
        <Depth01Area>
            <ul className="depth1_list">
                { category && category.map((item, idx) => {
                    return category.indexOf(item) === idx && <li key={uuid()}>
                            <Depth01Link>{item}</Depth01Link>
                            {/* <NavDepth02 sub={item}></NavDepth02> */}
                        </li>
                })}
            </ul>
        </Depth01Area>
    );
}

const Depth01Area = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    min-height: 380px;
    background-color: ${({theme}) => theme.lightMode.gray200};
    border-bottom: 1px solid ${({theme}) => theme.lightMode.gray500};
    z-index: 20;
`

const Depth01Link = styled(Link)`
    display: flex;
    align-items: center;
    position: relative;
    min-height: calc((380px - 9px) / 9);
    padding: 0 13px;
    font-size: 17px;
    border-bottom: 1px solid ${({theme}) => theme.lightMode.gray500};
`