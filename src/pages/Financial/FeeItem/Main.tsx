// import { TreeEntity } from '@/model/models'; 
import Page from '@/components/Common/Page';
import { DefaultPagination } from '@/utils/defaultSetting';
// import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useContext, useEffect, useState } from 'react';
import { GetFeeTreeList, GetPageListJson, GetUnitFeeItemData, GetAllFeeItems } from './Main.service';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import HouseInfoList from './HouseInfoList';
import { SiderContext } from '../../SiderContext';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Sider } = Layout;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [FeeKind, SetFeeKind] = useState<string>('');
  const [FeeType, SetFeeType] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // const [houseSearch, setHouseSearch] = useState<string>('');
  const [houseFeeItemSearch, setHouseFeeItemSearch] = useState<string>('');

  const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [housePagination, setHousePagination] = useState<PaginationConfig>(new DefaultPagination());
  const [houseData, setHouseData] = useState<any[]>([]);
  const [feeitems, setFeeitems] = useState<any[]>([]);

  const { hideSider, setHideSider } = useContext(SiderContext);

  const selectTree = (item, search) => {
    var value = item.node.props.value;
    var title = item.node.props.title;
    var feeKind = "", feeType = "";
    switch (value) {
      case "All":
        feeKind = "";
        feeType = "";
        break;
      case "FeeType":
        feeType = title;
        feeKind = item.node.props.AttributeA;
        break;
      case "PaymentItem":
        feeKind = title;
        feeType = "";
        break;
      case "ReceivablesItem":
        feeKind = title;
        feeType = "";
        break;
      default:
        feeKind = title;
        feeType = "";
        break;
    }
    initLoadData(feeKind, feeType, search);
    initHouseLoadData(feeKind, feeType, search);
    SetFeeKind(feeKind);
    SetFeeType(feeType);
  };


  useEffect(() => {
    GetFeeTreeList().then((res) => {
      setTreeData(res || []);
    });

    GetAllFeeItems().then(res => {
      setFeeitems(res || []);
    });
    initLoadData('', '', '');
    initHouseLoadData('', '', '');

  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (id?) => {
    setModifyVisible(true);
    setId(id);
  };
  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { FeeKind: FeeKind, FeeType: FeeType, keyword: search },
    };
    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'feeitemid';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'feeitemid';
    data.sord = data.sord || 'asc';
    return GetPageListJson(data).then(res => {
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
  const initLoadData = (FeeKind, FeeType, search) => {
    setSearch(search);
    const queryJson = { FeeKind: FeeKind, FeeType: FeeType, keyword: search };
    const sidx = 'feeitemId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };


  const houseLoadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    //setHouseSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { FeeKind: FeeKind, FeeType: FeeType, keyword: search, FeeItemID: houseFeeItemSearch },
    };
    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'unitfeeid';
    }
    return houseLoad(searchCondition).then(res => {
      return res;
    });
  };
  const houseLoad = data => {
    setHouseLoading(true);
    data.sidx = data.sidx || 'unitfeeid';
    data.sord = data.sord || 'asc';
    return GetUnitFeeItemData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setHousePagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setHouseData(res.data);
      setHouseLoading(false);
      return res;
    });
  };
  const initHouseLoadData = (FeeKind, FeeType, search) => {
    setSearch(search);
    const queryJson = { FeeKind: FeeKind, FeeType: FeeType, keyword: search, FeeItemID: houseFeeItemSearch };
    const sidx = 'feeitemId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return houseLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      {/* <Sider theme="light" style={{ overflow: 'hidden', height: '1000px' }} width="245px">
        {treeData != null && treeData.length > 0 ?
          (<LeftTree
            key='lefttree'
            treeData={treeData}
            selectTree={(id, item) => {
              selectTree(item, search);
            }}
          />) : null}
      </Sider>  */}


      <Sider
        theme="light"
        style={{ overflow: 'visible', position: 'relative', height: 'calc(100vh + 10px)' }}
        width={hideSider ? 20 : 245}
      >
        {hideSider ? (
          <div style={{ position: 'absolute', top: '40%', left: 5 }}>
            <Icon
              type="double-right"
              onClick={() => {
                setHideSider(false);
              }}
              style={{ color: '#1890ff' }}
            />
          </div>
        ) : (
            <>
              {treeData != null && treeData.length > 0 ?
                (<LeftTree
                  key='lefttree'
                  treeData={treeData}
                  selectTree={(id, item) => {
                    selectTree(item, search);
                  }}
                />) : null}
              <div
                style={{ position: 'absolute', top: '40%', right: -15 }}
                onClick={() => {
                  setHideSider(true);
                }}
              >
                <Icon type="double-left" style={{ color: '#1890ff', cursor: 'pointer' }} />
              </div>
            </>
          )}
      </Sider>

      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="费项列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                key='search'
                className="search-input"
                placeholder="搜索费项名称"
                style={{ width: 200 }}
                onSearch={value => loadData(value)}
              />
              <Button type="primary" style={{ float: 'right' }} key='add'
                onClick={() => showDrawer()}
              >
                <Icon type="plus" />
                费项
                </Button>
            </div>

            <ListTable
              key='ListTable'
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(FeeKind, FeeType, search)}
            />
          </TabPane>
          <TabPane tab="房屋费项列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Select style={{ width: '150px', marginRight: '5px' }}
                placeholder="请选择" onChange={(value) => {
                  setHouseFeeItemSearch(value);
                }}
              >
                {feeitems.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.title}
                  </Select.Option>
                ))}
              </Select>
              <Search
                key='search'
                className="search-input"
                placeholder="搜索费项名称"
                style={{ width: 200 }}
                onSearch={value => houseLoadData(value)}
              />
            </div>
            <HouseInfoList
              key='HouseInfoList'
              onchange={(paginationConfig, filters, sorter) =>
                houseLoadData(search, paginationConfig, sorter)
              }
              loading={houseLoading}
              pagination={housePagination}
              data={houseData}
            />
          </TabPane>
        </Tabs>
      </Content>


      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={treeData}
        id={id}
        reload={() => initLoadData(FeeKind, FeeType, search)}
      />
    </Layout>
  );
}
export default Main;
