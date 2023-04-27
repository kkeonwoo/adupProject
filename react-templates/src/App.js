import React from 'react';
import { BrowserRouter, Link } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import GlobalStyle from 'styles/globalStyle';
import theme from 'styles/theme';
import CustomButton from 'components/Button/Button';
import Title from 'components/Title/Title';
import Content from 'components/Content/Content';
import styled from 'styled-components';
import Select from 'components/Select/Select';
import Modal from 'components/Modal/Modal'
import InputCheckRadio from 'components/InputCheckRadio/InputCheckRadio';
import Form from 'components/Form/Form';
import Tab from 'components/Tab/Tab';
import Swiper from 'components/MainSwiper/MainSwiper';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Container>
        <ContentWrap>
            <Title>파비콘</Title>
            <Content>
              <Link to="https://www.favicon-generator.org/" target="_blank">https://www.favicon-generator.org/</Link>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Button</Title>
            <Content>
              <CustomButton color="primary">기본 버튼</CustomButton>
              <CustomButton color="primary" disabled>기본 버튼</CustomButton>
              <CustomButton color="secondary">기본 버튼</CustomButton>
              <br />
              <br />
              <CustomButton roundPill color="primary">기본 버튼</CustomButton>
              <CustomButton roundPill color="primary" disabled>기본 버튼</CustomButton>
              <CustomButton roundPill color="secondary">기본 버튼</CustomButton>
              <br />
              <br />
              <CustomButton color="primary" invert>기본 버튼</CustomButton>
              <CustomButton color="primary" disabled invert>기본 버튼</CustomButton>
              <CustomButton color="secondary" invert>기본 버튼</CustomButton>
              <br />
              <br />
              <CustomButton roundPill color="primary" invert >기본 버튼</CustomButton>
              <CustomButton roundPill color="primary" disabled invert >기본 버튼</CustomButton>
              <CustomButton roundPill color="secondary" invert >기본 버튼</CustomButton>
              <br />
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Select</Title>
            <Content>
              <Select optionData={['option1', 'option2', 'option3']}></Select>
              <br />
              <br />
              <Select optionData={['option1', 'option2', 'option3', 'option4', 'option5', 'option6', 'option7', 'option8', 'option9', 'option10']}></Select>
              <br />
              <br />
              <Select optionData={['option1', 'option2', 'option3']}></Select>
              <select name="option1" id="">
                <option value="1">option1-01</option>
                <option value="2">option1-02</option>
                <option value="3">option1-03</option>
              </select>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Checkbox</Title>
            <Content>
              <InputCheckRadio type={'checkbox'}>Checkbox1</InputCheckRadio>
              <InputCheckRadio type={'checkbox'}>Checkbox2</InputCheckRadio>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Radio</Title>
            <Content>
              <InputCheckRadio type={'radio'} id={1} name={'radio01'}>radio1</InputCheckRadio>
              <InputCheckRadio type={'radio'} id={2} name={'radio01'}>radio2</InputCheckRadio>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Form</Title>
            <Content>
              <Form label={'form_label'} placeHolder={'Input text'}></Form>
              <br />
              <br />
              <div className='d_flex gap_px_10'>
                <Form w={50} label={'form_label'} placeHolder={'Input text'}></Form>
                <Form w={50} label={'form_label'} placeHolder={'Input text'}></Form>
              </div>
              <br />
              <br />
              <div className='d_flex gap_px_10'>
                <Form w={33} column={true} label={'form_label'} placeHolder={'Input text'}></Form>
                <Form w={33} column={true} disabled={true} label={'form_label'} placeHolder={'Input text'}></Form>
                <Form w={33} column={true} label={'form_label'} placeHolder={'Input text'}></Form>
              </div>
              <br />
              <br />
              <Form inputGroup={true} inputGroupTxt={'http://'} dir={'left'} label={'form_label'} placeHolder={'Input text'}></Form>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Tab</Title>
            <Content>
              <Tab tabData={['탭 1-1', '탭 1-2', '탭 1-3']} tabContData={['탭1', '탭2', '탭3']}></Tab>
            </Content>
          </ContentWrap>
          <ContentWrap>
            <Title>Modal</Title>
            <Content>
              <Modal maskCloseable={true}>
                modalTest01
              </Modal>
            </Content>
          <ContentWrap>
            <Title>Swiper</Title>
            <Content>
              <Swiper></Swiper>
            </Content>
          </ContentWrap>
          </ContentWrap>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const Container = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;
`

const ContentWrap = styled.section`
  & + & { margin-top: 20px}
`

export default App;
