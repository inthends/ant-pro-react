
import { DefaultPagination } from '@/utils/defaultSetting';
import { DatePicker, Select, Button, Icon, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './Main.service';
// import { GetQuickSimpleTreeAllForDeskService } from '@/services/commonItem';
// import { getResult } from '@/utils/networkUtils';
const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
//查看
import RShowLink from '../Repair/ShowLink';
import CShowLink from '../Complaint/ShowLink';

//搜索条件
interface SearchParam {
  orgId: string;
  orgType: string;
  keyword: string;
  status: string;
  source: string;
  billType: string;
  billDateBegin: string;
  billDateEnd: string;
}

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>();
  // const [treeData, setTreeData] = useState<any[]>([]); 
  // const [search, setSearch] = useState<string>('');//单号
  // const [status, setStatus] = useState<string>('');//状态
  // const [source, setSource] = useState<string>('');//单据来源
  // const [billType, setBillType] = useState<string>('');//业务类型
  // const [billDateBegin, setBillDateBegin] = useState<string>('');//单据时间
  // const [billDateEnd, setBillDateEnd] = useState<string>('');//单据时间

  const [search, setSearch] = useState<SearchParam>({
    orgId: '',
    orgType: '',
    keyword: '',
    status: '',
    source: '',
    billType: '',
    billDateBegin: '',
    billDateEnd: '',
  });

  const selectTree = (id, type, info) => {
    // initLoadData(info.node.props.dataRef, search);
    // SetOrganize(info.node.props.dataRef);
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    var orgId = id;
    var orgType = '';
    if (id != '') {
      orgType = info.node.props.type;
    }
    loadData({ ...search, orgId, orgType }, page);
  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg);
    //   initLoadData('', '');
    // }); 
    //获取房产树
    // GetQuickSimpleTreeAllForDeskService()
    //   .then(getResult)
    //   .then((res: any[]) => {
    //     setTreeData(res || []);
    //     // return res || [];
    //   }); 
    initLoadData(search);

  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     //const treeList = (res || []).map(item => {
  //     //   return {
  //     //     ...item,
  //     //     id: item.id,
  //     //     text: item.name,
  //     //     parentId: item.pId,
  //     //   };
  //     // });
  //     setTreeData(res || []);
  //     return res || [];
  //   });
  // };

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (item?) => {
    setCurrData(item);
    setModifyVisible(true);
  };

  const loadData = (
    searchParam: any,
    paginationConfig?: PaginationConfig,
    sorter?) => {

    // setSearch(searchText);
    // setStatus(status);
    // setSource(source);
    // setBillType(billType);
    // setBillDateBegin(billDateBegin);
    // setBillDateEnd(billDateEnd);

    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };

    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: searchParam
      // queryJson: {
      //   keyword: searchText,
      //   // OrganizeId: org.organizeId,
      //   TreeTypeId: org.key,
      //   TreeType: org.type,
      //   status: status,
      //   source: source,
      //   billType: billType,
      //   billDateBegin: billDateBegin,
      //   billDateEnd: billDateEnd
      // },
    };
    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'billDate';
    formData.sord = formData.sord || 'desc';
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

  const initLoadData = (searchParam: SearchParam) => {
    setSearch(searchParam);
    const queryJson = searchParam;
    // const queryJson = {
    //   // OrganizeId: org.organizeId,
    //   keyword: searchText,
    //   TreeTypeId: org.key,
    //   TreeType: org.type,
    //   status: status,
    //   source: source,
    //   billType: billType,
    //   billDateBegin: billDateBegin,
    //   billDateEnd: billDateEnd
    // };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [repairVisible, setRepairVisible] = useState<boolean>(false);//查看 
  const [complaintVisible, setComplaintVisible] = useState<boolean>(false);//查看 
  const [billCode, setBillCode] = useState<any>();

  //查看关联单据
  const showLinkDrawer = (type, code) => {
    if (type == "Repair") {
      setRepairVisible(true);
    } else {
      setComplaintVisible(true);
    }
    setBillCode(code);
  };

  const closeLinkDrawer = (type) => {
    if (type == "Repair") {
      setRepairVisible(false);
    }
    else {
      setComplaintVisible(false);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(pid, type, info) => {
          selectTree(pid, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Search
            className="search-input"
            placeholder="搜索服务单号"
            onSearch={keyword => loadData({ ...search, keyword })}
            style={{ width: 180, marginRight: '5px' }}
          />

          <Select placeholder="=单据状态="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={status => loadData({ ...search, status })}>
            <Option value="1">待处理</Option>
            <Option value="2" >待完成</Option>
            <Option value="3">待回访</Option>
            <Option value="4">待检验</Option>
            <Option value="5">已归档</Option>
            <Option value="-1">已作废</Option>
          </Select>

          <Select placeholder="=单据来源="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={source => loadData({ ...search, source })}>
            <Option value="服务总台">服务总台</Option>
            <Option value="社区APP">社区APP</Option>
            <Option value="微信公众号">微信公众号</Option>
            <Option value="员工APP">员工APP</Option>
          </Select>

          <Select placeholder="=服务类型="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={billType => loadData({ ...search, billType })}>
            <Option value="咨询">咨询</Option>
            <Option value="建议">建议</Option>
            <Option value="报修">报修</Option>
            <Option value="投诉">投诉</Option>
          </Select>

          <DatePicker
            placeholder='单据日期起'
            onChange={(data,billDateBegin) => loadData({ ...search, billDateBegin })}
            style={{ marginRight: '5px', width: '130px' }} />
              至
              <DatePicker
            placeholder='单据日期止'
            onChange={(date,billDateEnd) => loadData({ ...search, billDateEnd })}
            style={{ marginLeft: '5px', marginRight: '5px', width: '130px' }} />

          <Button type="primary" style={{ float: 'right' }} onClick={() => showDrawer()}>
            <Icon type="plus" />
            服务单
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
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        // treeData={treeData}
        data={currData}
        reload={() => initLoadData(search)}
        showLink={showLinkDrawer}
      />

      <RShowLink
        showVisible={repairVisible}
        closeDrawer={closeLinkDrawer}
        billCode={billCode}
      />

      <CShowLink
        showVisible={complaintVisible}
        closeDrawer={closeLinkDrawer}
        billCode={billCode}
      />
    </Layout>
  );
}
export default Main;
