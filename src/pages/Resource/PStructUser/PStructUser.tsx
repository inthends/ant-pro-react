import { DefaultPagination } from '@/utils/defaultSetting';
import { Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetPageListJson } from './PStructUser.service';
import Modify from './Modify';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

function PublicArea() {
  const searchDefault = {
    Code: '',
    Name: '',
    CertificateNO: '',
    PhoneNum: '',
  };
  const [CustCate, setCustCate] = useState<string>('1');
  const [Type, setType] = useState<string>('Code');
  const [search, setSearch] = useState<string>('');

  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();

  useEffect(() => {
    initLoadData({ searchCustCate: '1', searchType: 'Code', searchText: '' });
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = (
    { searchCustCate, searchType, searchText },
    paginationConfig?: PaginationConfig,
    sorter?,
  ) => {
    setSearch(searchText);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    let queryJson: any = { ...searchDefault, CustCate: searchCustCate };
    queryJson[searchType] = searchText;
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson,
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'id';
    formData.sord = formData.sord || 'asc';
    return GetPageListJson(formData).then(res => {
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

  const initLoadData = ({ searchCustCate, searchType, searchText }) => {
    let queryJson: any = { ...searchDefault, CustCate: searchCustCate };
    queryJson[searchType] = searchText;
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };
  const changeCustCate = ({ searchCustCate, searchType, searchText }) => {
    setCustCate(searchCustCate);
    initLoadData({ searchCustCate, searchType, searchText });
  };
  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ padding: '0 20px', overflow: 'auto' }}>
        <div style={{ marginBottom: '20px', padding: '3px 0' }}>
          <Select
            value={CustCate}
            onChange={e => {
              changeCustCate({ searchCustCate: e, searchType: Type, searchText: search });
            }}
          >
            <Option value="1" key="1">
              个人
            </Option>
            <Option value="2" key="2">
              单位
            </Option>
          </Select>

          <Select value={Type} onChange={setType} style={{ marginLeft: 50, width: 100 }}>
            <Option value="Code" key="Code">
              编码
            </Option>
            <Option value="Name" key="Name">
              名称
            </Option>
            <Option value="CertificateNO" key="CertificateNO">
              证件编号
            </Option>
            <Option value="PhoneNum" key="PhoneNum">
              手机号码
            </Option>
          </Select>

          <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value =>
              loadData({ searchCustCate: CustCate, searchType: Type, searchText: value })
            }
            style={{ width: 200 }}
          />
          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer({flag: CustCate})}>
            <Icon type="plus" />
            住户资料
          </Button>
        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(
              { searchCustCate: CustCate, searchType: Type, searchText: search },
              paginationConfig,
              sorter,
            )
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() =>
            initLoadData({ searchCustCate: CustCate, searchType: Type, searchText: search })
          }
        />
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() =>
          initLoadData({ searchCustCate: CustCate, searchType: Type, searchText: search })
        }
      />
    </Layout>
  );
}

export default PublicArea;
