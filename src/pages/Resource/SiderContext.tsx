import React, { useState } from 'react';

const SiderContext = React.createContext<SiderContextStates>({});

interface SiderContextStates {
  hideSider?: boolean;
  setHideSider?: any;
}

const SiderContextProvider = props => {
  const [hideSider, setHideSider] = useState(false);
  return (
    <SiderContext.Provider value={{ hideSider, setHideSider }}>
      {props.children}
    </SiderContext.Provider>
  );
};

export { SiderContext, SiderContextProvider };
