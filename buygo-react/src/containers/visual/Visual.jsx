import Etc from 'components/Etc';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import Service from './Service';
import NavDepth01 from 'components/NavDepth01';
import SwiperBanner from 'components/SwiperBanner';

export default function Visual() {
    const [ categoryOpen, setCategoryOpen ] = useState(true);
    const handleCategory = () => setCategoryOpen((prev) => !prev);
    return (
        <Visual>
            <Nav>
                <CategoryArea>
                    <CategoryBtn open={categoryOpen} type='button' onClick={handleCategory}>카테고리</CategoryBtn>
                    { categoryOpen && <NavDepth01 >

                    </NavDepth01>}
                </CategoryArea>
                <Service/>
                <Etc/>
            </Nav>
            <BannerArea>
                { categoryOpen && <SwiperBanner/>}
            </BannerArea>
        </Visual>
    );
}

const Nav = styled.nav`
    display: flex;
    width: 1200px;
    margin: 0 auto;
    background-color: ${({theme}) => theme.lightMode.danger };
`

const CategoryArea = styled.div`
    position: relative;
`

const CategoryBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 16px;
    width: 225px;
    height: 60px;
    padding: 18px;
    font-weight: 700;
    font-size: 21px;
    color: ${({theme}) => theme.lightMode.white };

    &::before {
        content: '';
        display: block;
        width: 15px;
        height: 15px;
        background-image:  url(${require('assets/images/icons/arw_up_white_sm.svg').default});
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% auto;
        transition: transform .4s;
        transform: ${(props) => props.open ? 'rotate(0deg)' : 'rotate(180deg)'};
    }
`

const BannerArea = styled.div`
    width: 1200px;
    margin: 0 auto;
`