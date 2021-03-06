import { Col, Row } from 'antd';
import React, { Component, Suspense } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RadioChangeEvent } from 'antd/es/radio';
// import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
// import PageLoading from './components/PageLoading';
// import { getTimeDistance } from './utils/utils';
import { AnalysisData } from './data.d';
// import styles from './style.less';

// const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
// const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSalesLeft = React.lazy(() => import('./components/ProportionSalesLeft'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));

// const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface AnalysisProps {
  dashboardAnalysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface AnalysisState {
  salesType: 'all' | 'online' | 'stores';
  currentTabKey: string;
  // rangePickerValue: RangePickerValue;
  orgId: any;//机构id
  orgType: any;//机构类型
}

@connect(
  ({
    dashboardAnalysis,
    loading,
  }: {
    dashboardAnalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAnalysis,
    loading: loading.effects['dashboardAnalysis/fetch'],
  }),
)
class Analysis extends Component<
AnalysisProps,
AnalysisState
> {

  state: AnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    // rangePickerValue: getTimeDistance('year'),
    orgId: '',
    orgType: ''
  };

  reqRef: number = 0;
  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;

    this.reqRef = requestAnimationFrame(() => {

      //加载机构
      dispatch({
        type: 'dashboardAnalysis/fetchOrgs',
      });

      dispatch({
        type: 'dashboardAnalysis/fetch',
        orgId: '',
        orgType: ''
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = (e: RadioChangeEvent) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });
  };

  // handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     rangePickerValue,
  //   });
  //   dispatch({
  //     type: 'dashboardAnalysis/fetchSalesData',
  //   });
  // };

  onOrgChange = (orgId, label, extra) => {
    var orgType = '';
    if (!orgId) {
      orgId = '';
    } else {
      orgType = extra.triggerNode.props.type;
    }
    this.setState({
      orgId, orgType
    }); 
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/fetch',
      orgId: orgId,
      orgType: orgType
    });
  };


  // selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     rangePickerValue: getTimeDistance(type),
  //   });
  //   dispatch({
  //     type: 'dashboardAnalysis/fetchSalesData',
  //   });
  // };

  // isActive = (type: 'today' | 'week' | 'month' | 'year') => {
  //   const { rangePickerValue } = this.state;
  //   const value = getTimeDistance(type);
  //   if (!rangePickerValue[0] || !rangePickerValue[1]) {
  //     return '';
  //   }
  //   if (
  //     rangePickerValue[0].isSame(value[0], 'day') &&
  //     rangePickerValue[1].isSame(value[1], 'day')
  //   ) {
  //     return styles.currentDate;
  //   }
  //   return '';
  // };

  render() {
    const { orgId, salesType//rangePickerValue, //, currentTabKey
    } = this.state;
    const { dashboardAnalysis, loading } = this.props;
    const {
      // monthReceivables,
      // visitData,
      // visitData2,
      monthReceiveData,
      receiveData,
      payTypeData,
      payTypeDataOnline,
      payTypeDataOffline,
      // searchData,
      // offlineData,
      // offlineChartData,
      feeTypeData,
      treeData

    } = dashboardAnalysis;

    let payPieData;
    if (salesType === 'all') {
      payPieData = payTypeData;
    } else {
      payPieData = salesType === 'online' ? payTypeDataOnline : payTypeDataOffline;
    }
    // const menu = (
    //   <Menu>
    //     <Menu.Item>操作一</Menu.Item>
    //     <Menu.Item>操作二</Menu.Item>
    //   </Menu>
    // );

    // const dropdownGroup = (
    //   <span className={styles.iconGroup}>
    //     <Dropdown overlay={menu} placement="bottomRight">
    //       <Icon type="ellipsis" />
    //     </Dropdown>
    //   </span>
    // );

    // const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    return (
      <GridContent>
        <React.Fragment>
          {/* <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={visitData} monthReceivables={monthReceivables} />
          </Suspense> */}
          <Suspense fallback={null}>
            <SalesCard
              // rangePickerValue={rangePickerValue}
              orgId={orgId}
              monthReceiveData={monthReceiveData}
              receiveData={receiveData}
              // isActive={this.isActive}
              // handleRangePickerChange={this.handleRangePickerChange}
              onOrgChange={this.onOrgChange}
              loading={loading}
              treeData={treeData}
            // selectDate={this.selectDate}
            />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
              marginBottom: 24
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSalesLeft
                  // dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={payPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>

            {/* <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col> */}

            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  // dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={feeTypeData}
                // handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>

          </Row>

          {/* <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense> */}

        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
