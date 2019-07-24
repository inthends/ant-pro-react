import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Checkbox,Tabs ,Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'; 
import { GetTreeListExpand, GetPageListJson ,ChargeFeePageData} from './Main.service';
import LeftTree from '../LeftTree';
import ListTable from './ListTable';
import ChargeListTable from './ChargeListTable';
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
  const [dataCharge, setChargeData] = useState<any[]>([]); 
  const [paginationCharge, setPaginationCharge] = useState<PaginationConfig>(new DefaultPagination());
  const [id, setId] = useState<string>();
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
    initLoadData(search);  
};

  useEffect(() => {
    getTreeData().then(res => {  
      initLoadData('');
      initChargeLoadData('');
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
      queryJson: { keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'id';
    } 
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
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

  const loadChargeData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: paginationCharge.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billID';
    } 
    return loadCharge(searchCondition).then(res => {
      return res;
    });
  };

  const loadCharge = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billID';
    data.sord = data.sord || 'asc';
    return ChargeFeePageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });   
      setChargeData(res.data);
      setLoading(false);
      return res;
    });
  }; 

  const initLoadData = (search) => {
    setSearch(search);
    const queryJson = { keyword: search };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const initChargeLoadData = (search) => {
    setSearch(search);
    const queryJson = { keyword: search };
    const sidx = 'billID';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadCharge({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
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
  <TabPane tab="未收" key="1"> 

<div style={{ marginBottom: '20px', padding: '3px 2px' }}>
   <Search
    className="search-input"
    placeholder="搜索费项名称" 
    style={{ width: 200 }}
    onSearch={value => loadData(value)}
  /> 

  <Checkbox style={{  padding: '20px' }} >显示该户其他费用</Checkbox>   
  <Button type="primary" style={{ float: 'right' }}  
  onClick={() => showDrawer()}
  >
    <Icon type="plus" />
    加费
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
      reload={() => initLoadData( search)}
    />

  </TabPane>
  <TabPane tab="已收" key="2">
      
  <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
   <Search
    className="search-input"
    placeholder="搜索费项名称" 
    style={{ width: 200 }}
    onSearch={value => loadChargeData(value)}
  /> 
 
  <Button type="primary" style={{ float: 'right' }}  
  onClick={() => showDrawer()}
  >
    <Icon type="plus" />
    审核
  </Button>
</div>
  <ChargeListTable
      onchange={(paginationConfig, filters, sorter) =>
        loadChargeData(search, paginationConfig, sorter)
      }
      loading={loading}
      pagination={paginationCharge}
      data={dataCharge}
      modify={showDrawer}
      reload={() => initChargeLoadData(search)}
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
