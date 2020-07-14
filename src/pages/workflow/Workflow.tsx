import React from 'react';
import { SiderContextProvider } from '../SiderContext';

const Workflow = props => {
  return ( 
    <SiderContextProvider>{props.children}</SiderContextProvider> 
  );
};
export default Workflow;
