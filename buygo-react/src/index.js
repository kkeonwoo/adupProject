import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import Mypage from 'pages/Mypage';
import Cart from 'pages/Cart';
import Login from 'pages/Login';
import SignUp from 'pages/SignUp';
import Cs from 'pages/Cs';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import GlobalStyle from "components/styles/GlobalStyle";
import Theme from "components/styles/Theme";
import { ThemeProvider } from "styled-components";
import SearchResult from 'pages/SearchResult';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/mypage',
        element: <Mypage />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/result/:search',
        element: <SearchResult />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signUp',
        element: <SignUp />
      },
      {
        path: '/cs',
        element: <Cs />
      },
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={Theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
