//添加客户
import { Button, Icon, Input, Form, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { DefaultPagination } from '@/utils/defaultSetting';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTableSelect from './ListTableSelect';
import { GetPageListJsonForSelect } from './PStructUser.service';
import QuickModify from './QuickModify';

const { Search } = Input;

interface CustomerSelectProps {
  visible: boolean;
  closeModal(): void;
  Select(object: any): void;
  form: WrappedFormUtils;
  organizeId: string;
  type: string;
}

const CustomerSelect = (props: CustomerSelectProps) => {
  const { visible, closeModal, Select, organizeId, type } = props;
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  useEffect(() => {
    if (visible) {
      initLoadData('');
    }
  }, [visible]);


  const [data, setData] = useState<any[]>([]);

  const initLoadData = (searchText) => {
    const queryJson = { keyword: searchText, type: type };
    const sidx = 'code';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'code';
    formData.sord = formData.sord || 'asc';
    return GetPageListJsonForSelect(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };

  const loadData = (
    searchText,
    paginationConfig?: PaginationConfig,
    sorter?,
  ) => {
    setSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: searchText, type: type },
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'code';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const [selectItem, setselectItem] = useState<any>({});
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [currData, setCurrData] = useState<any>();

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  return (
    <Modal
      title="选择客户"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        Select(selectItem);
        closeModal();
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='1100px'>
      <div style={{ marginBottom: '20px', padding: '3px 0' }}>
        <Search
          className="search-input"
          placeholder="搜索名称和编号"
          onSearch={value =>
            loadData(value)
          }
          style={{ width: 200 }}
        />
        <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
          <Icon type="plus" />
            客户
          </Button>
      </div>
      <ListTableSelect
        onchange={(paginationConfig, filters, sorter) =>
          loadData(
            search,
            paginationConfig,
            sorter,
          )
        }
        type={type}
        Select={(res) => setselectItem(res)}
        loading={loading}
        pagination={pagination}
        data={data}
        modify={showDrawer}
        reload={() =>
          initLoadData(search)
        } />

      <QuickModify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        organizeId={organizeId}
        data={currData}
        reload={() =>
          initLoadData(search)
        } />

    </Modal>
  );
};
export default Form.create<CustomerSelectProps>()(CustomerSelect);

