
import { DefaultPagination } from '@/utils/defaultSetting';
import { DatePicker, Select, Input, Layout } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import Modify from './Modify';
import { GetPageListJson } from './Main.service';
import ShowLink from '../ServiceDesk/ShowLink';
import { GetCommonItems } from '@/services/commonItem';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [organize, SetOrganize] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  // const [currData, setCurrData] = useState<any>(); 
  const [id, setId] = useState<any>();

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');//状态
  const [repairMajor, setRepairMajor] = useState<string>('');//维修专业
  const [repairArea, setRepairArea] = useState<string>('');//维修区域
  const [isPaid, setIsPaid] = useState<string>('');//是否有偿
  const [billDateBegin, setBillDateBegin] = useState<string>('');//单据时间
  const [billDateEnd, setBillDateEnd] = useState<string>('');//单据时间
  const [repairMajors, setRepairMajors] = useState<any[]>([]); // 维修专业

  const selectTree = (id, type, info) => {
    // initLoadData(info.node.props.dataRef, search);
    SetOrganize(info.node.props.dataRef);
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, info.node.props.dataRef,
      status,
      repairMajor,
      repairArea,
      isPaid,
      billDateBegin,
      billDateEnd,
      page);

  };

  useEffect(() => {
    // getTreeData().then(res => {
    //   const root = res.filter(item => item.parentId === '0');
    //   const rootOrg = root.length === 1 ? root[0] : undefined;
    //   SetOrganize(rootOrg); 
    // });
    //获取维修专业
    GetCommonItems('RepairMajor').then(res => {
      setRepairMajors(res || []);
    });
    initLoadData('', '');
  }, []);

  // 获取属性数据
  // const getTreeData = () => {
  //   return GetQuickPStructsTree().then((res: any[]) => {
  //     // const treeList = (res || []).map(item => {
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
  const showDrawer = (id?) => {
    //setCurrData(item);
    setId(id);
    setModifyVisible(true);
  };
  const loadData = (
    searchText,
    org,
    status,
    repairMajor,
    repairArea,
    isPaid,
    billDateBegin,
    billDateEnd,
    paginationConfig?: PaginationConfig, sorter?) => {

    setSearch(searchText);
    setStatus(status);
    setRepairMajor(repairMajor);
    setRepairArea(repairArea);
    setIsPaid(isPaid);
    setBillDateBegin(billDateBegin);
    setBillDateEnd(billDateEnd);

    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    const searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: searchText,
        // OrganizeId: org.organizeId,
        TreeTypeId: org.key,
        TreeType: org.type,
        status: status,
        repairMajor: repairMajor,
        repairArea: repairArea,
        isPaid: isPaid,
        billDateBegin: billDateBegin,
        billDateEnd: billDateEnd
      },
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

  const initLoadData = (org, searchText) => {
    setSearch(searchText);
    const queryJson = {
      //OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.key,
      TreeType: org.type,
      status: status,
      repairMajor: repairMajor,
      repairArea: repairArea,
      isPaid: isPaid,
      billDateBegin: billDateBegin,
      billDateEnd: billDateEnd
    };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const [serverVisible, setServerVisible] = useState<boolean>(false);
  const [billId, setBillId] = useState<any>('');

  //查看关联单据
  const showLinkDrawer = (billId) => {
    setServerVisible(true);
    setBillId(billId);
  };

  const closeLinkDrawer = () => {
    setServerVisible(false);
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
            placeholder="搜索报修单号"
            onSearch={value =>
              loadData(value,
                organize,
                status,
                repairMajor,
                repairArea,
                isPaid,
                billDateBegin,
                billDateEnd
              )}
            style={{ width: 180, marginRight: '5px' }}
          />


          <Select placeholder="=单据状态="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={value => {
              loadData(search,
                organize,
                value,
                repairMajor,
                repairArea,
                isPaid,
                billDateBegin,
                billDateEnd
              );
            }}>
            <Option value="1">待派单</Option>
            <Option value="2">待接单</Option>
            <Option value="3">待开工</Option>
            <Option value="4">待完成</Option>
            <Option value="5">待回访</Option>
            <Option value="6">待检验</Option>
            <Option value="7">待审核</Option>
            <Option value="8">已审核</Option>
            <Option value="-1">已作废</Option>
          </Select>

          <Select placeholder="=维修专业="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={value => {
              loadData(search,
                organize,
                status,
                value,
                repairArea,
                isPaid,
                billDateBegin,
                billDateEnd
              );
            }}  >

            {repairMajors.map(item => (
              <Option value={item.title} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>

          <Select placeholder="=维修区域="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={value => {
              loadData(search,
                organize,
                status,
                repairMajor,
                value,
                isPaid,
                billDateBegin,
                billDateEnd
              );
            }} >
            <Option value="客户区域">客户区域</Option>
            <Option value="公共区域">公共区域</Option>
          </Select>

          <Select
            placeholder="=是否有偿="
            allowClear={true}
            style={{ width: '125px', marginRight: '5px' }}
            onChange={value => {
              loadData(search,
                organize,
                status,
                repairMajor,
                repairArea,
                value,
                billDateBegin,
                billDateEnd
              );
            }}
          >
            <Option value="否">否</Option>
            <Option value="是">是</Option>
          </Select>

          <DatePicker
            placeholder='单据日期起'
            onChange={(date, dateStr) => {
              loadData(search,
                organize,
                status,
                repairMajor,
                repairArea,
                isPaid,
                dateStr,
                billDateEnd);
            }} style={{ marginRight: '5px', width: '130px' }} />
              至
              <DatePicker
            placeholder='单据日期止'
            onChange={(date, dateStr) => {
              loadData(search,
                organize,
                status,
                repairMajor,
                repairArea,
                isPaid,
                billDateBegin,
                dateStr);
            }} style={{ marginLeft: '5px', marginRight: '5px', width: '130px' }} />


        </div>
        <ListTable
          onchange={(paginationConfig, filters, sorter) =>
            loadData(
              search,
              organize,
              status,
              repairMajor,
              repairArea,
              isPaid,
              billDateBegin,
              billDateEnd,
              paginationConfig, sorter)
          }
          loading={loading}
          pagination={pagination}
          data={data}
          modify={showDrawer}
          reload={() => initLoadData(organize, search)}
        />
      </Content>

      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        reload={() => initLoadData(organize, search)}
        showLink={showLinkDrawer}
      />

      <ShowLink
        showVisible={serverVisible}
        closeDrawer={closeLinkDrawer}
        billId={billId}
      />

    </Layout>
  );
}

export default Main;
