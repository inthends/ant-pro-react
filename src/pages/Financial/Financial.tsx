// import PageLayout from '@/layouts/PageLayout';
import React from 'react';
import { SiderContextProvider } from '../SiderContext';

const Financial = props => {
  return ( 
    <SiderContextProvider>{props.children}</SiderContextProvider> 
  );
};
export default Financial;
