export class DefaultPagination {
  total = 0;
  current = 1;
  pageSize = 10;
  showSizeChanger = true;
  showQuickJumper = true;
  pageSizeOptions = ['10', '20', '50', '100'];
  showTotal = (total, range) => `当前${range[0]}-${range[1]},共${total}条`;
}
