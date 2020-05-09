import { PaginationProps } from 'antd/lib/pagination';

export const DefaultPage: PaginationProps = {
  total: 0,
  current: 1,
  pageSize: 20,
  showQuickJumper: true,
  defaultCurrent: 1,
  defaultPageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50','100', '300'],
};

export const enum ParamTypes {
  请求参数 = 1,
  响应参数 = 2,
}
