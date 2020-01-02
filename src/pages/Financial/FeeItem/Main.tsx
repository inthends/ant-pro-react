// import { TreeEntity } from '@/model/models';
// import Page from '@/components/Common/Page';
import { DefaultPagination } from '@/utils/defaultSetting';
// import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useContext, useEffect, useState } from 'react';
import { GetFeeTreeList, GetPageListJson, GetUnitFeeItemData, GetAllFeeItems } from './Main.service';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import HouseInfoList from './HouseInfoList';
import { SiderContext } from '../../SiderContext';
import { getResult } from '@/utils/networkUtils';
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
  const [search, setSearch] = useState<string>('');//费项搜素关键字

  const [houseSearch, setHouseSearch] = useState<string>('');//费项房屋搜索关键字
  const [houseFeeItemId, setHouseFeeItemId] = useState<any>('');//费项搜索id
  const [houseLoading, setHouseLoading] = useState<boolean>(false);
  const [housePagination, setHousePagination] = useState<PaginationConfig>(new DefaultPagination());
  const [houseData, setHouseData] = useState<any[]>([]);
  const [feeitems, setFeeitems] = useState<any[]>([]);
  const { hideSider, setHideSider } = useContext(SiderContext);
  const [selectedTreeNode, setSelectTreeNode] = useState<any>({});
  const [isInit, setIsInit] = useState<boolean>(false);
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  const selectTree = (item, search) => {
    var value = item.node.props.value;
    var title = item.node.props.title;

    //console.log(item.node.props);

    var feeKind = "", feeType = "";
    switch (value) {
      case "All":
        feeKind = "";
        feeType = "";
        setSelectTreeNode({ feeKind: feeKind, feeType: item.node.props.title });
        break;
      case "FeeType":
        feeType = title;
        feeKind = item.node.props.attributeA;
        setSelectTreeNode({ feeKind: item.node.props.attributeA, feeType: item.node.props.title });
        break;
      case "PaymentItem":
        feeKind = title;
        feeType = "";
        setSelectTreeNode({ feeKind: item.node.props.title, feeType: '' });
        break;
      case "ReceivablesItem":
        feeKind = title;
        feeType = "";
        setSelectTreeNode({ feeKind: item.node.props.title, feeType: '' });
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

    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
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
    if (id) {
      setIsInit(false);
    } else {
      setIsInit(true);
    }
  };

  const initLoadData = (feeKind, feeType, search) => {
    // setSearch(search);
    const queryJson = { FeeKind: feeKind, FeeType: feeType, keyword: search };
    const sidx = 'feeName';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {

    //赋值,必须，否则查询条件会不起作用
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'feeName';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'feeName';
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


  //加载费项房屋
  const houseLoadData = (search, feeItemId, paginationConfig?: PaginationConfig, sorter?) => {
    setHouseSearch(search);//必须赋值，否则数据不更新
    setHouseFeeItemId(feeItemId); 
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: housePagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { FeeKind: FeeKind, FeeType: FeeType, keyword: search, feeItemId: feeItemId },
    };
    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'unitFeeId';
    }
    return houseLoad(searchCondition).then(res => {
      return res;
    });
  };

  const houseLoad = data => {
    setHouseLoading(true);
    data.sidx = data.sidx || 'unitFeeId';
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
    const queryJson = { FeeKind: FeeKind, FeeType: FeeType, keyword: search, FeeItemID: houseFeeItemId };
    const sidx = 'unitFeeId';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = housePagination;
    return houseLoad({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //页签切换刷新
  const changeTab = key => {
    if (key == "1") {
      initLoadData(FeeKind, FeeType, search);
    } else {
      initHouseLoadData(FeeKind, FeeType, search);
    }
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
        <Tabs defaultActiveKey="1" onChange={changeTab}>
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
                onClick={() => { showDrawer(); }}
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
              <Select
                allowClear={true}
                style={{ width: '160px', marginRight: '5px' }}
                placeholder="请选择费项"
                onChange={(value) => houseLoadData(houseSearch, value)}
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
                placeholder="搜索房屋编号"
                style={{ width: 180 }}
                onSearch={(value) => houseLoadData(value, houseFeeItemId)}
              />
            </div>
            <HouseInfoList
              key='HouseInfoList'
              onchange={(paginationConfig, filters, sorter) =>
                houseLoadData(search, houseFeeItemId, paginationConfig, sorter)
              }
              loading={houseLoading}
              pagination={housePagination}
              data={houseData}
              reload={() => initHouseLoadData(FeeKind, FeeType, search)}
            />
          </TabPane>
        </Tabs>
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        treeData={unitTreeData}
        selectTreeItem={selectedTreeNode}
        id={id}
        reload={() => initLoadData(FeeKind, FeeType, search)}
        isInit={isInit}
      />
    </Layout>
  );
}
export default Main;
