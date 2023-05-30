import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function HeaderButton({path, children}) {
    const navigate = useNavigate();
    return (
        <HeaderBtn onClick={() => {navigate(`/${path}`)}}>
            <BtnIco path={path}>
                { path === 'cart' && <BtnCount>4</BtnCount>}
            </BtnIco>
            <BtnTxt>{children}</BtnTxt>
        </HeaderBtn>
    );
}

const HeaderBtn = styled.button`
    position: relative;
`

const BtnIco = styled.i`
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background-position: center center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-image: ${(props) => `url(${require(`../../assets/images/icons/ico_${props.path}.svg`)})`};
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
    background-color: #e8380c;
    font-family: ;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    border-radius: 100%;
`