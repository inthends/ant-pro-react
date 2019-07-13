import React, { HTMLAttributes } from 'react';

import styles from './index.less';

function GlassPanel(props: HTMLAttributes<any>) {
  const { children, ...restProps } = props;
  return (
    <div {...restProps} className={styles.glassPanel}>
      {children}
    </div>
  );
}

export default GlassPanel;
