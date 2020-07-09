
import { message, Modal, Divider, PageHeader, Drawer, Col, Button, Card, Form, Row, Table } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { RemoveUnitForm, GetUnitPageListJson } from "./Apartment.service";
import { DefaultPagination } from "@/utils/defaultSetting";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import styles from './style.less';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
};

const Modify = (props: ModifyProps) => {
  const { data, closeDrawer, visible } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [infoDetail, setInfoDetail] = useState<any>({});

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (data) {
        //获取明细
        setInfoDetail(data);
        initLoadData();
      }
    }
  }, [visible]);

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "code";
    formData.sord = formData.sord || "asc";
    return GetUnitPageListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setItemData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = () => {
    const queryJson = { memberId: data.id };
    const sidx = "code";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  //刷新
  const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { memberId: data.id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'code';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

  //解绑
  const doCancle = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确定要解绑${record.code}？`,
      onOk: () => {
        RemoveUnitForm(record.id)
          .then(() => {
            message.success("解绑成功");
            initLoadData();
          })
          .catch(e => { });
      }
    });
  };

  const columns = [
    {
      title: "房产编号",
      dataIndex: "code",
      key: "code",
      width: 160,
    },
    {
      title: "房产面积(㎡)",
      dataIndex: "area",
      key: "area",
      width: 100
    },
    {
      title: "默认房屋",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 80,
      align:'center',
      render: val => val ? '是' : '否'
    },
    {
      title: "类型",
      dataIndex: "memberType",
      key: "memberType",
      width: 60,
      align:'center',
      render: val => val == 1 ? '业主' : '住户'
    },
    {
      title: "房产全称",
      dataIndex: "allName",
      key: "allName",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 70,
      render: (text, record) => {
        // if (record.state == '历史') {
        //   return null;
        // } else {
        //   return [
        //     <a onClick={() => doCancle(record)} key="cancle">解绑</a>
        //   ];
        // }
        return <a onClick={() => doCancle(record)} key="cancle">解绑</a>;
      }
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title='会员信息'
      placement="right"
      width={780}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >
      <PageHeader
        ghost={false} 
        title={null}
        subTitle={
          <div>
            <label style={{ color: '#4494f0', fontSize: '24px' }}>{infoDetail.nickName}</label>
          </div>
        }
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}
        extra={[<img src={infoDetail.headImgUrl}></img>]} >
        <Form layout='vertical'>
          <Row gutter={6}>
            <Col lg={3}>
              <Form.Item label="姓名" >
                {infoDetail.name}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="手机号码" >
                {infoDetail.mobile}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item label="所属机构" >
                {infoDetail.orgName}
              </Form.Item>
            </Col>
            <Col lg={2}>
              <Form.Item label="积分" >
                {infoDetail.scores}
              </Form.Item>
            </Col>
            <Col lg={5}>
              <Form.Item label="注册时间" >
                {infoDetail.createDate}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* <Divider dashed />
        {infoDetail.allName} */}
      </PageHeader>
      <Divider dashed />

      <Card className={styles.card}  hoverable>
        <Table
          style={{ border: 'none' }}
          bordered={false}
          size="middle"
          dataSource={itemData}
          columns={columns}
          rowKey={record => record.id}
          pagination={pagination}
          // scroll={{ x: 650 }}
          loading={loading}
          onChange={(pagination: PaginationConfig, filters, sorter) =>
            changePage(pagination, filters, sorter)
          }
        />
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          zIndex: 999,
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}  >
          关闭
        </Button>
      </div>
    </Drawer>

  );
};

export default Form.create<ModifyProps>()(Modify);
