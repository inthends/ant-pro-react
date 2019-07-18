import React, { useState } from 'react';

const SiderContext = React.createContext<SiderContextStates>({});

interface SiderContextStates {
  hideSider?: boolean;
  SetHideSider?: any;
}

const SiderContextProvider = props => {
  const [hideSider, SetHideSider] = useState(false);
  return (
    <SiderContext.Provider value={{ hideSider, SetHideSider }}>
      {props.children}
    </SiderContext.Provider>
  );
};

export { SiderContext, SiderContextProvider };
