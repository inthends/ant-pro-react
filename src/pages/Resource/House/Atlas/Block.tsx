import React  from 'react';
import styles from './index.less';
interface BlockProps {
  title: string;
  borderColor: string;
  background: string;
}
const Block = (props: BlockProps) => {
  const { title, borderColor, background } = props;
  return (
    <div className={styles.blockAndTitle}>
      <div className={styles.block} style={{ background, borderColor }} />
      <span>{title}</span>
    </div>
  );
};
export default Block;
