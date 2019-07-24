import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Tabs ,Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'; 
import { GetTreeListExpand, GetPageListJson } from './Main.service';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import Modify from './Modify';

const { Sider, Content } = Layout;
const { Search } = Input;
const{TabPane} = Tabs;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
 
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();

  const [FeeKind, SetFeeKind] = useState<string>('');
  const [FeeType, SetFeeType] = useState<string>('');

  const [search, setSearch] = useState<string>('');

  const disabledCreate = (treeData: TreeEntity[], organizeId: string) => {
    for (let item of treeData) {
      if (item.id === organizeId && item.parentId !== '0') {
        return false;
      }
    }
    return true;
  };

  const selectTree = (item, search) => {    
    
    var feeKind = "", feeType = "";
    switch (item.value) {
      case "All":
          feeKind = "";
          feeType = ""; 
          break;
      case "FeeType":
          feeType = item.text;
          feeKind = item.AttributeValue;
          break;
      case "PaymentItem": 
          feeKind = item.text;
          feeType = "";
          break;
      case "ReceivablesItem": 
          feeKind = item.text;
          feeType = "";
          break;
      default:
          feeKind = item.text;
          feeType = "";
          break;
  }
 
    SetFeeKind(feeKind);
    SetFeeType(feeType); 
    initLoadData(feeKind, feeType,search); 

};

  useEffect(() => {
    getTreeData().then(res => { 
      SetFeeKind('');
      SetFeeType('');
      initLoadData('','','');
    }); 
  }, []);
  // 获取属性数据
  const getTreeData = () => {
    return GetTreeListExpand()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
      });
  };
 
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
      queryJson: { FeeKind: FeeKind,FeeType:FeeType, keyword: search },
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
debugger
      setData(res.data);
      setLoading(false);
      return res;
    });
  };
  const initLoadData = (FeeKind, FeeType, search) => {
    setSearch(search);
    const queryJson = { FeeKind: FeeKind,FeeType:FeeType, keyword: search };
    const sidx = 'feeitemid';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Sider theme="light" style={{ overflow: 'hidden', height: '100%' }} width="245px">
        <LeftTree
          treeData={treeData}
          selectTree={(id,item) => {   
            selectTree(item, search);
          }}
        />
      </Sider>
      <Content style={{ padding: '0 20px' }}>

<Tabs defaultActiveKey="1" >
  <TabPane tab="费项列表" key="1"> 

<div style={{ marginBottom: '20px', padding: '3px 2px' }}>
  <Search
    className="search-input"
    placeholder="搜索费项名称" 
    style={{ width: 200 }}
    onSearch={value => loadData(value)}
  />
  <Button type="primary" style={{ float: 'right' }}  
  onClick={() => showDrawer()}
  >
    <Icon type="plus" />
    费项
  </Button>
</div>

    <ListTable
      onchange={(paginationConfig, filters, sorter) =>
        loadData(search, paginationConfig, sorter)
      }
      loading={loading}
      pagination={pagination}
      data={data}
      modify={showDrawer}
      reload={() => initLoadData(FeeKind, FeeType,search)}
    />

  </TabPane>
  <TabPane tab="房屋费项列表" key="2">

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
