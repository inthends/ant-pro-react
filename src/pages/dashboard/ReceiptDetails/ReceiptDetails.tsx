//账单明细
import { DefaultPagination } from '@/utils/defaultSetting';
import { Modal, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetBillDetailsPageList, ExportBillDetails } from './ReceiptDetails.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
const { Content } = Layout;
const { Search } = Input;

function ReceiptDetails() {

  const [loading, setLoading] = useState<boolean>(false);
  const [listData, setListData] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [organize, setOrganize] = useState<any>({});
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());

  const selectTree = (id, item, searchText) => {
    setOrganize(item);
    initLoadData(item, '');
  };

  useEffect(() => {
    initLoadData('', '');
  }, []);

  const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'meterkind';
    }
    return load(searchCondition);
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'meterkind';
    data.sord = data.sord || 'asc';
    return GetBillDetailsPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setListData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = (org, searchText) => {
    setSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'feeId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  //导出
  const doExport = (org, searchText) => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要导出吗？`,
      onOk: () => {
        const queryJson = {
          // OrganizeId: org.organizeId,
          // keyword: searchText,
          // TreeTypeId: org.id,
          // TreeType: org.type,
        };
        ExportBillDetails(queryJson).then(res => { 
          //window.open(res);  
          window.location.href = res; 
        });
      },
    });
  };

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, '');
        }}
      />
      <Content style={{ paddingLeft: '18px' }}> 
        <div style={{ marginBottom: '20px', padding: '3px 2px' }} > 
          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            style={{ width: 200 }}
            onChange={e => {
            }}
          />
          <Button type="primary" style={{ marginLeft: '10px' }}
            onClick={() => { loadData() }}
          >
            <Icon type="search" />
            查询
          </Button>

          <Button type="primary" style={{ float: 'right' }}
            onClick={() => { doExport('','') }}
          >
            <Icon type="export" />
            导出
          </Button>

        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) => {
            loadData(paginationConfig, sorter)
          }
          }
          loading={loading}
          pagination={pagination}
          data={listData}
        />
      </Content>
    </Layout >
  );
}

export default ReceiptDetails;
