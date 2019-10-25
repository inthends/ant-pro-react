//账单明细
import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetBillDetailsPageList } from './BillDetails.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

function BillDetails() {

  const [meterLoading, setMeterLoading] = useState<boolean>(false);
  const [meterData, setMeterData] = useState<any>();
  const [meterSearch, setMeterSearch] = useState<string>('');
  const [meterPagination, setMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const selectTree = (org, item, searchText) => {
    SetOrganize(item);
    initMeterLoadData(item, '');
  };


  useEffect(() => {
    initMeterLoadData('', '');
  }, []);


  const loadMeterData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: meterSearchParams.search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'meterkind';
    }

    return meterload(searchCondition);
  }


  const meterload = data => {
    setMeterLoading(true);
    data.sidx = data.sidx || 'meterkind';
    data.sord = data.sord || 'asc';


    return GetBillDetailsPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });

      setMeterData(res.data);
      setMeterLoading(false);
      return res;
    });
  };


  const initMeterLoadData = (org, searchText) => {
    setMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'meterkind';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = meterPagination;
    return meterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const [meterSearchParams, setMeterSearchParams] = useState<any>({});

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, '');
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>

        <div style={{ marginBottom: '20px', padding: '3px 2px' }} onChange={(value) => {
          var params = Object.assign({}, meterSearchParams, { metertype: value });
          setMeterSearchParams(params);
        }}>
          <Select placeholder="=请选择=" style={{ width: '120px', marginRight: '5px' }} onChange={value => {
            var params = Object.assign({}, meterSearchParams, { meterkind: value });
            setMeterSearchParams(params);
          }}>
            <Option value="private">单元表</Option>
            <Option value="public" >公用表</Option>
            <Option value="virtual">虚拟表</Option>
          </Select>
          <Search
            className="search-input"
            placeholder="请输入要查询的费表名称"
            style={{ width: 200 }}
            onChange={e => {
              var params = Object.assign({}, meterSearchParams, { search: e.target.value });
              setMeterSearchParams(params);
            }}
          />
          <Button type="primary" style={{ marginLeft: '10px' }}
            onClick={() => { loadMeterData() }}
          >
            <Icon type="search" />
            查询
              </Button>

        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) => {
            loadMeterData(paginationConfig, sorter)
          }
          }
          loading={meterLoading}
          pagination={meterPagination}
          data={meterData}
        />
      </Content>
    </Layout>
  );
}

export default BillDetails;
