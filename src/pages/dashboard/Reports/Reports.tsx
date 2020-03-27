import React from 'react';
import { Layout } from 'antd';
//active报表
// import '@grapecity/activereports/styles/ar-js-viewer.css';
// import { Viewer } from '@grapecity/activereports-react';
// import { PdfExport, HtmlExport, XlsxExport, Core } from '@grapecity/activereports';
// const { Content } = Layout;
function Reports() {
  return (
    <Layout style={{ height: '100%' }}>
      {/* 
       <div className="demo-app" style={{ height: '1000px'  }}  >
          <Viewer report={{ Uri: "test.rdlx" }} sidebarVisible={true} toolbarVisible zoom='100%' />
       </div> 
       */}

      <iframe
        style={{ height: 'calc(100vh - 115px)' }}
        scrolling="no"
        frameBorder='0'
        width='100%'
        src={localStorage.getItem('target') + "/index.html"} >
      </iframe>

    </Layout >
  );
}
export default Reports;
