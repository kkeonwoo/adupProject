import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function HeaderButton({path, children}) {
    const navigate = useNavigate();
    const handleSideSlide = (e) => {
        // 최근 본 상품 클릭 시
        console.log('최근 본 상품 클릭~!');
    }
    return (
        <HeaderBtn type='button' onClick={() => { path === "recent" ? handleSideSlide() : (navigate(`/${path}`)) }}>
            <BtnIco path={path}>
                { path === 'cart' && <BtnCount>4</BtnCount>}
            </BtnIco>
            <BtnTxt>{children}</BtnTxt>
        </HeaderBtn>
    );
}

const HeaderBtn = styled.button`
    position: relative;
    margin-right: 10px;
    &:last-child {
        margin-right: 0;
    }
`

const BtnIco = styled.i`
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-image: ${(props) => `url(${require(`../assets/images/icons/ico_${props.path}.svg`)})`};
`
const BtnTxt = styled.span`
    font-size: 12px;
`

const BtnCount = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: -7px;
    min-width: 21px;
    height: 21px;
    padding: 0 6px;
    background-color: ${({theme}) => theme.lightMode.danger};
    font-family: ${({theme}) => theme.fontFamily.Tahoma};
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    border-radius: 100%;
`