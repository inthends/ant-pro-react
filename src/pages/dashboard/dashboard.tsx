// import PageLayout from '@/layouts/PageLayout';
import React from 'react';
import { SiderContextProvider } from '../SiderContext';

const Dashboard = props => {
  return (
    // <PageLayout>
    <SiderContextProvider>{props.children}</SiderContextProvider>
    // </PageLayout>
  );
};
export default Dashboard;

