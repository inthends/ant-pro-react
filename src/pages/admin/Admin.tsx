// import PageLayout from '@/layouts/PageLayout';
import React from 'react';
import { SiderContextProvider } from '../SiderContext';

const Admin = props => {
  return (
    // <PageLayout>
    <SiderContextProvider>{props.children}</SiderContextProvider>
    // </PageLayout>
  );
};
export default Admin;
