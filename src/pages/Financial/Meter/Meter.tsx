//水电费管理
import { DefaultPagination } from '@/utils/defaultSetting';
import { getResult } from '@/utils/networkUtils';
import { Tabs, Button, Icon, Input, Layout ,Modal,Select} from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useContext, useEffect, useState } from 'react';
import { GetReceivablesFeeItemTreeJson, GetMeterPageList, GetUnitMeterPageList ,GetReadingMeterPageList, GetMeterFormsPageList , RemoveForm ,SaveForm} from './Meter.service';
import AsynLeftTree from '../AsynLeftTree';
import MeterTable from './MeterTable';
import MeterFormsTable from './MeterFormsTable';
import ReadingMeterTable from './ReadingMeterTable';
import UnitMeterTable from './UnitMeterTable';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const {Option} =Select;
function Meter() {
  const [organize, SetOrganize] = useState<any>({});
  const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();

  const [meterLoading, setMeterLoading] = useState<boolean>(false);
  const [meterFormsLoading, setMeterFormsLoading] = useState<boolean>(false);
  const [readingMeterLoading, setReadingMeterLoading] = useState<boolean>(false);
  const [unitMeterLoading, setUnitMeterLoading] = useState<boolean>(false);

  const [meterData, setMeterData] = useState<any>();
  const [unitMeterData, setUnitMeterData] = useState<any>();
  const [readingMeterData, setReadingMeterData] = useState<any>();
  const [meterFormsData, setMeterFormsData] = useState<any>();

  const [meterSearch,setMeterSearch] = useState<string>('');
  const [unitMeterSearch,setUnitMeterSearch] = useState<string>('');
  const [readingMeterSearch,setReadingMeterSearch] = useState<string>('');
  const [meterFormsSearch,setMeterFormsSearch] = useState<string>('');

  const [meterPagination, setMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [unitMeterPagination, setUnitMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [readingMeterPagination, setReadingMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [meterFormsPagination, setMeterFormsPagination] = useState<DefaultPagination>(new DefaultPagination());

  const selectTree = (org, item, searchText) => {
    SetOrganize(item);
  };

  useEffect(() => {
    initMeterLoadData('','');
    initUnitMeterLoadData('','');
    initMeterFormsLoadData('','');
    initReadingMeterLoadData('','')
  }, []);


  const loadMeterData=(search, paginationConfig?: PaginationConfig, sorter?)=>{
    setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'meterkind';
    }

    return meterload(searchCondition).then(res => {
      return res;
    });
  }
  const loadUnitMeterData=(search, paginationConfig?: PaginationConfig, sorter?)=>{
    setUnitMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: unitMeterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'unitmeterid';
    }

    return unitMeterload(searchCondition).then(res => {
      return res;
    });
  }
  const loadReadingMeterData=(search, paginationConfig?: PaginationConfig, sorter?)=>{
    setReadingMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: readingMeterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return readingMeterload(searchCondition).then(res => {
      return res;
    });
  }
  const loadMeterFormsData=(search, paginationConfig?: PaginationConfig, sorter?)=>{
    setMeterFormsSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterFormsPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return meterFormsload(searchCondition).then(res => {
      return res;
    });
  }
  const meterload = data => {
    setMeterLoading(true);
    data.sidx = data.sidx || 'meterkind';
    data.sord = data.sord || 'asc';
    return GetMeterPageList(data).then(res => {
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
  const unitMeterload = data => {
    setUnitMeterLoading(true);
    data.sidx = data.sidx || 'unitmeterid';
    data.sord = data.sord || 'asc';
    return GetUnitMeterPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setUnitMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setUnitMeterData(res.data);
      setUnitMeterLoading(false);
      return res;
    });
  };
  const readingMeterload = data => {
    setReadingMeterLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetReadingMeterPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setReadingMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setReadingMeterData(res.data);
      setReadingMeterLoading(false);
      return res;
    });
  };
  const meterFormsload = data => {
    setMeterFormsLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetMeterFormsPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterFormsPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setMeterFormsData(res.data);
      setMeterFormsLoading(false);
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
    //setAddButtonDisable(true);
    return meterload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(()=>{
      //setAddButtonDisable(false);
    });
  };
  const initUnitMeterLoadData = (org, searchText) => {
    setUnitMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'unitmeterid';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = unitMeterPagination;
    //setAddButtonDisable(true);
    return unitMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(()=>{
      //setAddButtonDisable(false);
    });
  };
  const initReadingMeterLoadData = (org, searchText) => {
    setReadingMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = readingMeterPagination;
    //setAddButtonDisable(true);
    return readingMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(()=>{
      //setAddButtonDisable(false);
    });
  };
  const initMeterFormsLoadData = (org, searchText) => {
    setMeterFormsSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = meterFormsPagination;
    //setAddButtonDisable(true);
    return meterFormsload({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    }).then(()=>{
     //setAddButtonDisable(false);
    });
  };

  const closeVertify = (result?) => {
    //setVertifyVisible(false);
    if(result){
     // initCheckLoadData(organize, null);
    }
    setId(null);
  };

  const showVertify = (id?,ifVertify?) => {
    //setVertifyVisible(true);
    //setIfVertify(ifVertify);
    setId(id);
  };
  const closeModify = (result?) => {
    //setModifyVisible(false);
    if(result){
      //initCheckLoadData(organize, null);
    }
  };

  const showModify = (id?) => {
    //setModifyVisible(true);
    setId(id);
  };
  //删除冲抵单
  const deleteData=(id?)=>{
    Modal.confirm({
      title: '是否确认删除该条抵冲记录?',
      onOk() {
        RemoveForm({
          keyValue:id
        }).then(res=>{

        });
      },
      onCancel() {},
    });
  }

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, treeSearch);
        }}
      />
      <Content style={{ padding: '0 20px' }}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="费表列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Select placeholder="=请选择=" style={{width:'120px',marginRight:'5px'}}>
                <Option value="private">单元表</Option>
                <Option value="public" >公用表</Option>
                <Option value="virtual">虚拟表</Option>
              </Select>
              <Search
                className="search-input"
                placeholder="请输入要查询的费表名称"
                style={{ width: 280 }}
                onSearch={value => loadMeterData(value)}
              />
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="check-square" />
                审核
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="file" />
                查看
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="plus" />
                新增
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="reload" />
                刷新
              </Button>
            </div>
            <MeterTable
              onchange={(paginationConfig, filters, sorter) =>
                loadMeterData(meterSearch, paginationConfig, sorter)
              }
              loading={meterLoading}
              pagination={meterPagination}
              data={meterData}
              reload={() => initMeterLoadData('', meterSearch)}
            />
          </TabPane>
          <TabPane tab="装表列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的名称或者编号"
                style={{ width: 280 }}
                onSearch={value => loadMeterFormsData(value)}
              />
            </div>

            <MeterFormsTable
              onchange={(paginationConfig, filters, sorter) =>
                loadMeterFormsData(meterFormsSearch, paginationConfig, sorter)
              }
              loading={meterFormsLoading}
              pagination={meterFormsPagination}
              data={meterFormsData}
              reload={() => initMeterFormsLoadData('', meterFormsSearch)}
            />
          </TabPane>
          <TabPane tab="抄表单列表" key="3">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的名称或者编号"
                style={{ width: 280 }}
                onSearch={value => loadReadingMeterData(value)}
              />
                <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => initReadingMeterLoadData(organize, null)}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="check-square" />
                审核
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="file" />
                查看
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() =>{}}
              >
                <Icon type="plus" />
                新增
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="reload" />
                刷新
              </Button>
            </div>
            <ReadingMeterTable
              onchange={(paginationConfig, filters, sorter) =>
                loadReadingMeterData(readingMeterSearch, paginationConfig, sorter)
              }
              loading={readingMeterLoading}
              pagination={readingMeterPagination}
              data={readingMeterData}
              reload={() => initReadingMeterLoadData('', readingMeterSearch)}
            />
          </TabPane>
          <TabPane tab="抄表列表" key="4">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的名称或者表编号"
                style={{ width: 280 }}
                onSearch={value => loadUnitMeterData(value)}
              />
            </div>
            <UnitMeterTable
              onchange={(paginationConfig, filters, sorter) =>
                loadUnitMeterData(unitMeterSearch, paginationConfig, sorter)
              }
              loading={unitMeterLoading}
              pagination={unitMeterPagination}
              data={unitMeterData}
              reload={() => initUnitMeterLoadData('', unitMeterSearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}

export default Meter;
