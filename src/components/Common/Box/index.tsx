import React from 'react';

import styles from './index.less';

interface BoxProps {
  style: React.CSSProperties;
  children: React.ReactNode;
}

function Box(props: BoxProps) {
  const { children, style = {} } = props;
  return (
    <div style={style} className={styles.box}>
      {children}
    </div>
  );
}

export default Box;
