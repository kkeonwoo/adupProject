import NavButton from 'components/common/NavButton';
import React from 'react';
import uuid from 'react-uuid';
import { styled } from 'styled-components';

export default function Service() {
    const serviceListArray = [
        { link:'/specialOrder', children: '특가상품'},
        { link:'/best', children: 'BEST'},
        { link:'/newGoods', children: '신상품'},
        { link:'/brandMall', children: '브랜드몰'},
        { link:'/combinedDel', children: '통합배송관'},
        { link:'/goodCop', children: '우수기업관'}
        ]
    return (
        <ServiceList>
            { serviceListArray && serviceListArray.map((listItem, idx) => {
                return <ServiceItem key={uuid()}>
                    <NavButton link={listItem.link}>{listItem.children}</NavButton>
                </ServiceItem>
            })}
        </ServiceList>
    );
}

const ServiceList = styled.ul`
    display: flex;
    align-items: center;
    padding: 0 15px;
`

const ServiceItem = styled.li`
    display: flex;
    align-items: center;
    &::after {
        content: '';
        display: block;
        width: 1px;
        height: 16px;
        margin: 0 18px;
        background-color: ${({theme}) => theme.lightMode.white };
    }
    &:last-child::after {
        content: none;
    }
`