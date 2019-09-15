import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { SaveForm, searchUser } from './User.service';
import { AccountEntity } from '@/model/accountEntity';

interface ModifyProps {
  visible: boolean;
  data?: AccountEntity;
  form: WrappedFormUtils<AccountEntity>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  let initData = data ? data : { accountType: 2, expMode: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();
  const [names, setNames] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<boolean>(true);
  useEffect(() => {
    setShowTime(initData.expMode === 2);
  }, [initData]);

  const baseFormProps = { form, initData };
  const expModes: SelectItem[] = [{ label: '永久有效', value: 1 }, { label: '临时', value: 2 }];
  const accountTypes: SelectItem[] = [
    { label: '系统初始账户', value: 1 },
    { label: '员工账户', value: 2 },
    { label: '客户账户', value: 3 },
    { label: '供应商账户', value: 4 },
    { label: '其他', value: 5 },
  ];
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    modifyData.expDate = modifyData.expDate ? modifyData.expDate.format('YYYY-MM-DD') : undefined;
    return SaveForm(modifyData);
  };
  const searchName = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
        };
      });
      setNames(users);
    });
  };

  return (
    <BaseModifyProvider {...props} name="用户" save={doSave}>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="name"
            label="用户"
            type="autoComplete"
            onSearch={searchName}
            items={names}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="account"
            label="账户"
            rules={[{ required: true, message: '请输入账户' }]}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            type="radio"
            field="expMode"
            label="有效期"
            items={expModes}
            onChange={(e) => setShowTime(e===2)}
          ></ModifyItem>
          {showTime ? (
            <ModifyItem
              {...baseFormProps}
              field="expDate"
              label="有效期限"
              type="date"
            ></ModifyItem>
          ) : null}
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            wholeLine={true}
            type="textarea"
            field="description"
            label="备注"
          ></ModifyItem>
        </Row>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
