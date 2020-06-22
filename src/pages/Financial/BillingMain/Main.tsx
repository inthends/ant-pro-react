//周期费计算
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs,  Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson, GetPageDetailListJson } from './Main.service';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import { getResult } from '@/utils/networkUtils';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import DetailTable from './DetailTable';
import Modify from './Modify';
import Verify from './Verify';
import Divide from './Divide';
import Show from './Show';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

import AuthButton from '@/components/AuthButton/AuthButton';

function Main() {
  // const [organize, SetOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [undetailData, setDetailData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [detailSearch, setDetailSearch] = useState<string>('');
  const [pagination, setPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [detailPagination, setDetailPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);
  const [divideVisible, setDivideVisible] = useState<boolean>(false);
  const [showVisible, setShowVisible] = useState<boolean>(false);

  //树查询
  const [orgId, setOrgId] = useState<string>('');//左侧树选择的id
  const [orgType, setOrgType] = useState<string>();//类型

  const doSelectTree = (orgId, type, info) => {
    //console.log(org,item,info);
    // SetOrganize(info.node.props.dataRef);
    // initLoadData(info.node.props.dataRef, search);
    // initLoadDetailData(info.node.props.dataRef, detailSearch); 
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, orgId, type, page);
    loadUnitMeterData(detailSearch, orgId, type, page);
  };

  useEffect(() => {
    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
      });
    initLoadData('', '', '');
    initLoadDetailData('', '', '');
  }, []);

  const loadData = (search, orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
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
      queryJson: {
        keyword: search,
        TreeTypeId: orgId,
        TreeType: type,
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return load(searchCondition);
  }

  const loadUnitMeterData = (search, orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
    setDetailSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: detailPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: search,
        TreeTypeId: orgId,
        TreeType: type,
      }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return unitLoad(searchCondition);
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'desc';
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

  const unitLoad = data => {
    setDetailLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'desc';
    return GetPageDetailListJson(data).then(res => {
      // console.log(res);
      const { pageIndex: current, total, pageSize } = res;
      setDetailPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setDetailData(res.data);
      setDetailLoading(false);
      return res;
    });
  };

  const initLoadData = (orgId, orgType, searchText) => {
    // console.log(org);
    // setMeterSearch(searchText);
    const queryJson = {
      //OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: orgId,//org.key,
      TreeType: orgType,//org.type,
    };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const initLoadDetailData = (orgId, orgType, searchText) => {
    setDetailSearch(searchText);
    const queryJson = {
      //OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: orgId,//org.key,
      TreeType: orgType,//org.type,
    };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = detailPagination;
    return unitLoad({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const closeDivide = () => {
    setDivideVisible(false);
  };

  const showDivide = () => {
    setDivideVisible(true);
  };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      loadData(search, orgId, orgType);
    }
    setId('');
  };

  const closeShow = (result?) => {
    setShowVisible(false);
    setId('');
  };

  const showVerify = (id?, ifVerify?) => {
    setVerifyVisible(true);
    setIfVerify(ifVerify);
    if (id != null && id != '')
      setId(id);
  };
  const closeModify = (result?) => {
    setModifyVisible(false);
    if (result) {
      //initCheckLoadData(organize, null);
    }
  };
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);

  const showModify = (id?, isedit?) => {
    setIsEdit(isedit);
    setModifyVisible(true);
    setId(id);
  };

  //查看费用
  const showFee = (id?) => {
    setShowVisible(true);
    if (id != null && id != '')
      setId(id);
  };

  // const deleteData = (id?) => {
  //   Modal.confirm({
  //     title: '是否确认删除该条抵冲记录?',
  //     onOk() {
  //       RemoveForm({
  //         keyvalue: id
  //       }).then(res => {
  //       });
  //     },
  //     onCancel() { },
  //   });
  // };

  // const [meterSearchParams, setMeterSearchParams] = useState<any>({});
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info) => {
          setOrgId(id);
          setOrgType(type);
          doSelectTree(id, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="计费单列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}
            // onChange={(value) => {
            //   var params = Object.assign({}, meterSearchParams, { metertype: value });
            //   setMeterSearchParams(params);
            // }}
            >
              <Search
                className="search-input"
                placeholder="搜索计费单号"
                style={{ width: 180 }}
                // onChange={e => {
                //   var params = Object.assign({}, meterSearchParams, { search: e.target.value });
                //   setMeterSearchParams(params);
                // }}
                onSearch={value => loadData(value, orgId, orgType)}

              />
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}  disabled={ifVerify?false:true}
              >
                <Icon type="minus-square" />
                权责摊销
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if(id==null||id=='')
                  {
                    message.warning('请先选择计费单');
                  }else{
                    showVerify('',false);
                  }
                }}  disabled={ifVerify?false:true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if(id==null||id=='')
                  {
                    message.warning('请先选择计费单');
                  }else{
                    showVerify('',true);
                  }
                }}
                disabled={ifVerify?true:false}
              >
                <Icon type="check-square" />
                审核
              </Button> */}
              {/* <Button type="primary" style={{ marginLeft: '10px' }}
                onClick={() => { loadMeterData() }}
              >
                <Icon type="search" />
                查询
              </Button> */}


              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, true) }}
              >
                <Icon type="plus" />
                新增
              </Button> */}

              <AuthButton
                style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => showModify(null, true)}
                module="Billingmain"
                code="add"
                btype="primary">
                <Icon type="plus" />
                新增
               </AuthButton>
 
            </div>
            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, orgId, orgType, paginationConfig, sorter)
              }
              showDivide={showDivide}
              loading={loading}
              pagination={pagination}
              data={data}
              showVerify={showVerify}
              showFee={showFee}
              showModify={(id, isedit) => {
                if (id != null && id != '') {
                  setId(id);
                }
                setIsEdit(isedit);
                setModifyVisible(true);
              }}
              reload={() => initLoadData(orgId, orgType, search)}
              getRowSelect={(record) => {
                setId(record.billId);
                if (record.ifVerify == 0) {
                  setIfVerify(true);
                } else {
                  setIfVerify(false);
                }
              }}
            />
          </TabPane>
          <TabPane tab="计费明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="搜索计费单号和房产编号"
                style={{ width: 220 }}
                onSearch={value => loadUnitMeterData(value, orgId, orgType)}
              />
            </div>
            <DetailTable
              onchange={(paginationConfig, filters, sorter) =>
                loadUnitMeterData(detailSearch, orgId, orgType, paginationConfig, sorter)
              }
              loading={detailLoading}
              pagination={detailPagination}
              data={undetailData}
              reload={() => initLoadDetailData(orgId, orgType, detailSearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        // organizeId={organize}
        id={id}
        isEdit={isEdit}
        reload={() => initLoadData(orgId, orgType, search)}
        treeData={unitTreeData}
      />
      <Verify
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initLoadData(orgId, orgType, search)}
      />

      <Show
        visible={showVisible}
        close={closeShow}
        id={id}
      />

      <Divide
        visible={divideVisible}
        closeModal={closeDivide}
        treeData={unitTreeData}
      />
    </Layout>
  );
}
export default Main;
