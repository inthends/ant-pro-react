import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { SaveForm, searchUser, ExistEnCode } from './Organize.service';
import { GetOrgsWithNoGLC } from '@/services/commonItem';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './style.less';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const { getFieldDecorator } = form;
  const [managers, setManagers] = useState<SelectItem[]>([]);
  // const [types, setTypes] = useState<SelectItem[]>([
  //   {
  //     label: '集团',
  //     value: 'A',
  //   },
  //   {
  //     label: '区域',
  //     value: 'B',
  //   },
  //   {
  //     label: '公司',
  //     value: 'C',
  //   },
  //   {
  //     label: '管理处',
  //     value: 'D',
  //   },
  // ]);
  const [orgs, setOrgs] = useState<TreeNode[]>();
  let initData = data ? data : { enabledMark: 1 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const baseFormProps = { form, initData };
  useEffect(() => {
    // getTypes();
    searchManager('');
    // getOrgs(); 
    GetOrgsWithNoGLC().then(res => {
      setOrgs(res);
    });
  }, []);

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.organizeId };
    if (modifyData.foundedTime != null)
      modifyData.foundedTime = modifyData.foundedTime.format('YYYY-MM-DD');
    //return SaveForm(modifyData);

    //刷新隶属上级
    return SaveForm(modifyData).then(() => {
      GetOrgsWithNoGLC().then(res => {
        setOrgs(res);
      });

    })

  };

  const searchManager = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
        };
      });
      setManagers(users);
    });
  };

  // const getTypes = () => {
  //   searchTypes().then(res => {
  //     const temp = res.map(item => {
  //       return {
  //         label: item.title,
  //         value: item.key,
  //       };
  //     });
  //     setTypes(temp);
  //   });
  // };

  // const getOrgs = () => {
  //   GetOrgs().then(res => {
  //     setOrgs(res);
  //   });
  // };

  const checkExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyValue = initData.organizeId == undefined ? '' : initData.organizeId;
      ExistEnCode(keyValue, value).then(res => {
        if (res)
          callback('机构编号重复');
        else
          callback();
      })
    }
  };

  //设置负责人
  const onSelect = (value, option) => { 
    form.setFieldsValue({ chargeLeaderId: option.key });
  };

  return (
    <BaseModifyProvider {...props} name="机构" save={doSave}>
      <Card className={styles.card}>
        <Form layout="vertical" hideRequiredMark>
        <Row gutter={24} hidden={initData.parentId == 0 ? true : false} >
            <ModifyItem
              {...baseFormProps}
              field="parentId"
              label="隶属上级"
              type="tree"
              treeData={orgs}
              disabled={initData.organizeId != undefined}
              rules={[{ required: true, message: '请选择隶属上级' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="category"
              label="类型"
              type="select"
              disabled={initData.parentId === '0'}
              items={[
                {
                  label: '集团',
                  value: 'A',
                },
                {
                  label: '区域',
                  value: 'B',
                },
                {
                  label: '公司',
                  value: 'C',
                },
                {
                  label: '管理处',
                  value: 'D',
                },
              ]}
              rules={[{ required: true, message: '请选择类型' }]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="fullName"
              label="机构名称"
              rules={[{ required: true, message: '请输入机构名称' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              field="enCode"
              label="机构编号"
              rules={[{ required: true, message: '请输入机构编号' },
              {
                validator: checkExist
              }
              ]}
            ></ModifyItem>
          </Row>

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="chargeLeader"
              label="负责人"
              type="autoComplete"
              onSearch={searchManager}
              items={managers}
              onSelect={onSelect}
            ></ModifyItem>

            {getFieldDecorator('chargeLeaderId', {
              initialValue: initData.chargeLeaderId,
            })(
              <input type='hidden' />
            )}

            <ModifyItem
              {...baseFormProps}
              field="foundedTime"
              label="成立时间"
              type="date"
            ></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem {...baseFormProps} field="phoneNum" label="联系电话"></ModifyItem>
            <ModifyItem {...baseFormProps} field="fax" label="传真"></ModifyItem>
          </Row>
          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              // wholeLine={true}
              lg={24}
              type="textarea"
              field="description"
              label="备注"
            ></ModifyItem>
          </Row>
        </Form>
      </Card>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);