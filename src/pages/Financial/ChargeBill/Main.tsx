import { TreeEntity } from '@/model/models';
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Checkbox, Tabs, Button, Icon, Input, Layout ,Select, DatePicker} from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetTreeListExpand, GetPageListJson, ChargeFeePageData } from './Main.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import ChargeListTable from './ChargeListTable';
import Modify from './Modify';
import Show from './Show';
import Vertify from './Vertify';
import Split from './Split';
import Transform from './Transform';
const { Sider, Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const {Option}=Select;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [addFeeVisible, setAddFeeVisibleisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [dataCharge, setChargeData] = useState<any[]>([]);
  const [paginationCharge, setPaginationCharge] = useState<PaginationConfig>(new DefaultPagination());
  const [id, setId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [organizeId, SetOrganizeId] = useState<string>('');
  const [addButtonDisable,setAddButtonDisable]=useState<boolean>(true);
  const [showCustomerFee,setShowCustomerFee]=useState<boolean>(false)

  const [splitVisible,setSplitVisible]=useState<boolean>(false);
  const [transVisible,setTransVisible]=useState<boolean>(false);
  const [billDetailVisible,setBillDetailVisible]=useState<boolean>(false);


  const [showVisible,setShowVisible]=useState<boolean>(false);
  const [vertifyVisible,setVertifyVisible]=useState<boolean>(false);
  const [ifVertify,setIfVertify]=useState<boolean>(false);

  const [flushVisible,setflushVisible]=useState<boolean>(false);

  const [chargeRowStatus,setChargeRowStatus]=useState<number>(0);
  const [billRowKey,setBillRowKey]=useState<number>(0);

  const selectTree = (item, search) => {
    console.log(item);
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
  const closeAddDrawer = () => {
    setAddFeeVisibleisible(false);
  };
  const showAddDrawer = () => {
    setAddFeeVisibleisible(true);
  };
  const showDrawer = (id?) => {
    setModifyVisible(true);
    if(id){
      setId(id);
    }else{
      setId('');
    }
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

  const initLoadData = (search,showCustomerFee=false) => {
    setSearch(search);
    setShowCustomerFee(showCustomerFee);
    const queryJson = { keyword: search ,roomid:organizeId,showCustomerFee:showCustomerFee};
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

  const onShowCustomerChange=(e:any)=>{
    initLoadData(search,e.target.checked);
  }

  //冲红
  const showFlush=()=>{
    setflushVisible(true);
  }

  const closeFlush=()=>{
    setflushVisible(false);
  }

  const showVertify=(id?:string,ifVertify:boolean)=>{
    setVertifyVisible(true);
    setIfVertify(ifVertify);
  }

  const closeVertify=()=>{
    setVertifyVisible(false);
  }

  const showBillDetail=()=>{
    setBillDetail(true);
  }

  const closeBillDetail=()=>{
    setBillDetail(false);
  }

  const showSplit=()=>{
    setSplitVisible(true);
  }

  const closeSplit=()=>{
    setSplitVisible(false);
  }

  const showTrans=()=>{
    setTransVisible(true);
  }

  const closeTrans=()=>{
    setTransVisible(false);
  }


  const showDetail=()=>{
    setShowVisible(true);
  }

  const closeDetail=()=>{
    setShowVisible(false);
  }

  const chargeRowSelect=(status:number)=>{
    setChargeRowStatus(status)
  }

  const onInvalid=()=>{

  }

  return (
    <Layout style={{ height: '100%' }}>
      <Sider theme="light" style={{ overflow: 'hidden', height: '100%' }} width="245px">
        <AsynLeftTree
          parentid={'0'}
          selectTree={(id, item) => {
            SetOrganizeId(id);
            setAddButtonDisable(false);
            selectTree(item, search);
          }}
        />
      </Sider>
      <Content style={{ padding: '0 20px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="未收列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="搜索费项名称"
                style={{ width: 200 }}
                onSearch={value => loadData(value)}
              />
              <Checkbox style={{ padding: '20px' }} onChange={onShowCustomerChange} >显示该户其他费用</Checkbox>

              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => {}}
                disabled={billRowKey==-1?true:false}
              >
                <Icon type="minus-square" />
                删除
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showTrans()}
                disabled={billRowKey==-1?true:false}
              >
                <Icon type="minus-square" />
                转费
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showSplit()}
                disabled={billRowKey==-1?true:false}
              >
                <Icon type="minus-square" />
                拆费
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVertify('',false)}
                disabled={billRowKey==-1?true:false}
              >
                <Icon type="minus-square" />
                查看
              </Button>

              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showDrawer()}
                disabled={addButtonDisable}
              >
                <Icon type="plus" />
                新增费用
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVertify('',false)}
              >
                <Icon type="minus-square" />
                刷新
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
              reload={() => initLoadData(search)}
            />
          </TabPane>
          <TabPane tab="收款单列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Select placeholder="=请选择=" style={{width:'140px',marginRight:'5px'}}>
                <Option key='2' value='2'>
                  {'已审核'}
                </Option>
                <Option key='1' value='未审核'>
                  {'未审核'}
                </Option>
                <Option key='3' value='已冲红'>
                  {'已冲红'}
                </Option>
                <Option key='-1' value='已作废'>
                  {'已作废'}
                </Option>
              </Select>
              <DatePicker style={{marginRight:'5px'}}/>
              至
              <DatePicker style={{marginLeft:'5px',marginRight:'5px'}}/>
              <Search
                className="search-input"
                placeholder="请输入要查询的关键字"
                style={{ width: 200 }}
                onSearch={value => loadChargeData(value)}
              />

              <Button type="danger" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => onInvalid()}
                disabled={chargeRowStatus==2||chargeRowStatus==-1||chargeRowStatus==0?true:false}
              >
                <Icon type="delete" />
                作废
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showFlush()}
                disabled={chargeRowStatus==3||chargeRowStatus==1||chargeRowStatus==-1||chargeRowStatus==0?true:false}
              >
                <Icon type="form" />
                冲红
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVertify('',false)}
                disabled={chargeRowStatus==3||chargeRowStatus==-1||chargeRowStatus==1||chargeRowStatus==0?true:false}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVertify('',true)}
                disabled={chargeRowStatus==3||chargeRowStatus==-1||chargeRowStatus==2||chargeRowStatus==0?true:false}
              >
                <Icon type="check-square" />
                审核
              </Button>
              <Button type="default" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showDetail()}
                disabled={chargeRowStatus==0?true:false}
              >
                <Icon type="file" />
                查看
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
              rowSelect={chargeRowSelect}
            />
          </TabPane>
        </Tabs>
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        reload={() => initLoadData(FeeKind, FeeType, search)}
      />
      <Show
        showVisible={showVisible}
        closeShow={closeDetail}
        id={id}
      />
      <Vertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeVertify}
        id={id}
        ifVertify={ifVertify}
      />
      <Split
        splitVisible={splitVisible}
        closeSplit={closeSplit}
        id={id}
      />
       <Transform
        transVisible={transVisible}
        closeTrans={closeTrans}
        id={id}
      />
    </Layout>
  );
}

export default Main;
