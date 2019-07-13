import React from 'react';

function Page(props) {
  const { children, style = {} } = props;
  const temp = { 
    background: '#ffffff',
    border: '1px solid #e8eaf3',
  };
  return <div style={{ ...style, ...temp }}>{children}</div>;
}

export default Page;
