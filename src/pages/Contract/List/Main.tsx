
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Row, Col, Card, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetPageListJson } from './Main.service';
import ListTable from './ListTable';
// import { getResult } from '@/utils/networkUtils';
import Add from './Add';
import Modify from './Modify';
import Detail from './Detail';
// import Approve from './Approve';
import Change from './Change';
import Renewal from './Renewal';
import Withdrawal from './Withdrawal';
// import ChooseUser from './ChooseUser';
// import { GetQuickSimpleTreeAllForContract } from '@/services/commonItem';
import styles from './style.less';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
import AsynLeftTree from '../AsynLeftTree';

function Main() {
  const [addVisible, setAddVisible] = useState<boolean>(false);//新建
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);//修改
  const [detailVisible, setDetailVisible] = useState<boolean>(false);//查看
  const [changeVisible, setChangeVisible] = useState<boolean>(false);//变更
  const [renewalVisible, setRenewalVisible] = useState<boolean>(false);//续租 
  const [withdrawalVisible, setWithdrawalVisible] = useState<boolean>(false);//退租  

  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [id, setId] = useState<string>();
  const [chargeId, setChargeId] = useState<string>();
  const [search, setSearch] = useState<string>('');
  // const [treeData, setTreeData] = useState<any[]>([]); 
  // const [userVisible, setUserVisible] = useState<boolean>(false); 

  const closeAddDrawer = () => {
    setAddVisible(false);
  };

  const showAddDrawer = (id?, chargeId?) => {
    setAddVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeModifyDrawer = () => {
    setModifyVisible(false);
  };

  const showModifyDrawer = (id?, chargeId?) => {
    setModifyVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeDetailDrawer = () => {
    setDetailVisible(false);
  };

  const showDetailDrawer = (id?, chargeId?) => {
    setDetailVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeChangeDrawer = () => {
    setChangeVisible(false);
  };

  //变更
  const showChangeDrawer = (id?, chargeId?) => {
    setChangeVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  //续租
  const showRenewalDrawer = (id?, chargeId?) => {
    setRenewalVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeRenewalDrawer = () => {
    setRenewalVisible(false);
  };

  //退租
  const showWithdrawalDrawer = (id?, chargeId?) => {
    setWithdrawalVisible(true);
    setId(id);
    setChargeId(chargeId);
  };

  const closeWithdrawalDrawer = () => {
    setWithdrawalVisible(false);
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
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'signingDate';
    }

    return load(searchCondition).then(res => {
      return res;
    });
  };
  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'signingDate';
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
  const initLoadData = (search) => {
    setSearch(search);
    const queryJson = { keyword: search };
    const sidx = 'signingDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  useEffect(() => {
    //获取房产树
    // GetQuickSimpleTreeAllForContract()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     return res || [];
    //   });
    initLoadData('');
  }, []);

  // const showChoose = () => {
  //   setUserVisible(true);
  //   // setCurrData(item);
  // };

  //显示信息
  const Info: React.FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    bordered?: boolean;
  }> = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'} 
      />

    <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="租控图" key="1" >



          </TabPane>

          <TabPane tab="合同列表" key="2" >
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="搜索合同编号"
                style={{ width: 160 }}
                onSearch={value => loadData(value)}
              />
              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showAddDrawer()}
              >
                <Icon type="plus" />
                合同
              </Button>
            </div>
            <Card className={styles.card}>
              <Row>
                <Col sm={4} xs={24}>
                  <Info title="新建待审核" value="8" bordered />
                </Col>
                <Col sm={4} xs={24}>
                  <Info title="变更待审核" value="2" bordered />
                </Col>
                <Col sm={4} xs={24}>
                  <Info title="退租待审核" value="5" bordered />
                </Col>

                <Col sm={4} xs={24}>
                  <Info title="作废待审核" value="4" bordered />
                </Col>

                <Col sm={4} xs={24}>
                  <Info title="到期未处理" value="7" bordered />
                </Col>
                <Col sm={4} xs={24}>
                  <Info title="正常执行" value="8" />
                </Col>
              </Row>
            </Card>
            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              detail={showDetailDrawer}
              modify={showModifyDrawer}
              // approve={showApproveDrawer}
              change={showChangeDrawer}
              renewal={showRenewalDrawer}
              withdrawal={showWithdrawalDrawer}
              reload={() => initLoadData(search)} />
          </TabPane>
        </Tabs>
      </Content>
      <Add
        visible={addVisible}
        closeDrawer={closeAddDrawer}
        // treeData={treeData}
        id={id}
        reload={() => initLoadData(search)}
      />
      <Modify
        visible={modifyVisible}
        closeDrawer={closeModifyDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Detail
        visible={detailVisible}
        closeDrawer={closeDetailDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />



      {/* <ChooseUser
        visible={userVisible}
        close={() => setUserVisible(false)}
      /> */}

      <Change
        visible={changeVisible}
        closeDrawer={closeChangeDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Renewal
        visible={renewalVisible}
        closeDrawer={closeRenewalDrawer}
        // treeData={treeData}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      // choose={showChoose}
      />

      <Withdrawal
        visible={withdrawalVisible}
        closeDrawer={closeWithdrawalDrawer}
        id={id}
        chargeId={chargeId}
        reload={() => initLoadData(search)}
      />

    </Layout>
  );
}

export default Main;
