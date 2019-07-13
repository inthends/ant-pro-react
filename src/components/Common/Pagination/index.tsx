import React from 'react';
import { Icon } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import classnames from 'classnames';

import styles from './index.less';

function Pagination(props: PaginationProps) {
  const { defaultCurrent = 1, total = 0, pageSize = 10, onChange } = props;
  const { current = defaultCurrent } = props;
  const page = Math.floor(total / pageSize) + 1;

  const singlePage = total <= pageSize;
  const leftDisable = current === 1 || singlePage;
  const rightDisable = current === page || singlePage;

  const changeHandler = pageNum => {
    if (onChange) {
      onChange(pageNum);
    }
  };
  return (
    <div className={styles.pagination}>
      <Icon
        type="double-left"
        onClick={() => {
          if (!leftDisable) {
            changeHandler(1);
          }
        }}
        className={classnames({
          [styles.disabled]: leftDisable,
        })}
      />
      <Icon
        type="left"
        onClick={() => {
          if (!leftDisable) {
            changeHandler(current - 1);
          }
        }}
        className={classnames({
          [styles.disabled]: leftDisable,
        })}
      />
      <Icon
        type="right"
        onClick={() => {
          if (!rightDisable) {
            changeHandler(current + 1);
          }
        }}
        className={classnames({
          [styles.disabled]: rightDisable,
        })}
      />
      <Icon
        type="double-right"
        onClick={() => {
          if (!rightDisable) {
            changeHandler(page);
          }
        }}
        className={classnames({
          [styles.disabled]: rightDisable,
        })}
      />
    </div>
  );
}

export default Pagination;
