import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    *{padding:0;margin:0;-webkit-text-size-adjust: none; -moz-text-size-adjust: none; -ms-text-size-adjust: none;box-sizing: border-box;-ms-box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;font-family: 'Noto Sans KR','맑은 고딕','sans-serif';font-size:16px;font-weight: 400; line-height: 1; color:var(--fn-black);}
    h1,h2,h3,h4,h5,h6,em,strong,li,dd,a,address{padding:0;margin:0;}
    html{overflow-y:scroll;}
    body,p,h1,h2,h3,h4,h5,h6,ul,ol,li,dl,dt,dd,table,th,tr,td,thead,tbody,form,fieldset,legend,input,textarea,button{margin:0;padding:0;}
    ul,ol,li,dl,dt,dd {list-style:none;}
    i,em,address{font-style:normal;}
    label,button{cursor:pointer;}
    button{border:none;background:none;vertical-align:middle;appearance: none;-webkit-appearance: none;border-radius: 0;-webkit-border-radius: 0;}
    img,fieldset,iframe {border:none;}
    img{vertical-align:top;}
    textarea{resize: vertical;}
    select {appearance: none;-webkit-appearance: none;-moz-appearance: none;-ms-appearance: none;-o-appearance: none;vertical-align:middle;border-radius: 0}
    select::-ms-expand {display: none;}
    input,textarea {appearance: none;-webkit-appearance: none;border-radius: 0;-webkit-border-radius: 0;}
    table{border:none; border-collapse:collapse; padding:0; border-spacing:0;table-layout: fixed;width:100%;}
    table td {word-break: break-all;}
    u {text-decoration:none;}
    a{text-decoration: none;background-color: transparent;-webkit-text-decoration-skip: objects;}
    font{ font-weight: inherit; font-size: inherit; line-height: inherit; color: inherit;}
    legend,caption {position: absolute;width: 1px !important;height: 1px !important;padding: 0 !important;margin: -1px !important;overflow: hidden !important;clip: rect(0, 0, 0, 0) !important;white-space: nowrap !important;border: 0 !important;}
    caption {position: static;color: transparent;}
    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    menu,
    nav,
    section {display: block;margin: 0;}
    audio,canvas,progress,video {display: inline-block;}
    ::-webkit-input-placeholder {font:16px 'Noto Sans KR', '맑은 고딕','sans-serif'; font-weight: 400; color: #D4D4D4;}
    ::-moz-placeholder {font:16px 'Noto Sans KR', '맑은 고딕', 'sans-serif'; font-weight: 400; color: #D4D4D4;}
    :-ms-input-placeholder {font:16px 'Noto Sans KR', '맑은 고딕', 'sans-serif'; font-weight: 400; color: #D4D4D4;}
    :-moz-placeholder {font:16px 'Noto Sans KR', '맑은 고딕', 'sans-serif'; font-weight: 400; color: #D4D4D4;}
    input[type=reset],
    input[type=button],
    input[type=submit] {-webkit-appearance: button;-moz-appearance: button;appearance: button;}
    input[type=search] {appearance: textfield; -webkit-appearance: textfield;}
    input[type=text]::-ms-clear,
    input[type=text]::-ms-reveal {display: none;}
    input[type=search]::-webkit-search-cancel-button,
    input[type=search]::-webkit-search-decoration {-webkit-appearance: none;}
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {-webkit-appearance: none;}

    input[type=text] { display: flex; width: 100%; align-items: center; color: #666; transition: text-indent 0.45s;}
    input[type=text]:focus { border-color: #666;}
    input[type=text]::placeholder { transition: all .25s ease;}
    input[type=text]:focus::placeholder { transform: translate(0.2em);}
`

export default GlobalStyles;