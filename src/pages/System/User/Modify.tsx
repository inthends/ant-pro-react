import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
// import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import ModifyItem from '@/components/BaseModifyDrawer/ModifyItem';
import { Card, Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { SaveForm, SearchUser, ExistAccount } from './User.service';
import { JcAccount } from '@/model/jcAccount';
import md5 from 'blueimp-md5';

interface ModifyProps {
  visible: boolean;
  data?: JcAccount;
  form: WrappedFormUtils<JcAccount>;
  closeDrawer(): void;
  reload(): void;
  treeDate: any[];
}
const Modify = (props: ModifyProps) => {
  const { data, form, treeDate } = props;
  const { getFieldDecorator } = form;
  let initData = data ? data : { accountType: 2, expMode: 1 };
  // initData.expDate = initData.expDate ? initData.expDate : new Date();
  const [names, setNames] = useState<any[]>([]);
  // const [showTime, setShowTime] = useState<boolean>(false);
  //useEffect(() => {
  // setShowTime(initData.expMode === 2); 
  //}, [initData]);

  const baseFormProps = { form, initData };
  // const expModes: SelectItem[] = [{ label: '永久有效', value: 1 }, { label: '临时', value: 2 }]; 
  // const accountTypes: SelectItem[] = [
  //   { label: '系统初始账户', value: 1 },
  //   { label: '员工账户', value: 2 },
  //   { label: '客户账户', value: 3 },
  //   { label: '供应商账户', value: 4 },
  //   { label: '其他', value: 5 },
  // ];
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyvalue: initData.id };
    //modifyData.expDate = modifyData.expDate ? modifyData.expDate.format('YYYY-MM-DD') : undefined;
    //密码前端加密
    modifyData.password = md5(modifyData.password);
    return SaveForm(modifyData);
  };

  const searchName = value => {
    const organizeId = form.getFieldValue('organizeId');
    SearchUser(organizeId, value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
          key: item.id,
        };
      });
      setNames(users);
    });
  };

  const onSelect = (value, option) => {
    form.setFieldsValue({ sourceId: option.key });
  };

  const checkAccountExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = initData.id == undefined ? '' : initData.id;
      ExistAccount(keyvalue, value).then(res => {
        if (res)
          callback('请输入用户名重复');
        else
          callback();
      })
    }
  };

  return (
    <BaseModifyProvider {...props} name="用户" save={doSave}>
      <Card>
        <Form layout="vertical" hideRequiredMark>

          {initData.id == undefined ? <div>

            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                field="organizeId"
                label="所属机构"
                type="tree"
                treeData={treeDate}
                rules={[{ required: true, message: '请选择所属机构' }]}
              ></ModifyItem>

              <ModifyItem
                {...baseFormProps}
                field="name"
                label="关联员工"
                type="autoComplete"
                onSearch={searchName}
                items={names}
                onSelect={onSelect}
              ></ModifyItem>

              {getFieldDecorator('sourceId', {
                initialValue: initData.sourceId,
              })(
                <input type='hidden' />
              )}
            </Row>

            <Row gutter={24}>
              <ModifyItem
                {...baseFormProps}
                field="account"
                label="用户名"
                // rules={[{ required: true, message: '请输入用户名' }]}
                rules={[{ required: true, message: '请输入用户名' }, { validator: checkAccountExist }]}
              ></ModifyItem>

              {initData.id == undefined ?
                <ModifyItem
                  {...baseFormProps}
                  field="password"
                  // type="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入密码' }]}
                  visibilityToggle={initData.id == undefined}
                ></ModifyItem> : null}
            </Row>

          </div> :
            <div>

              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="organizeId"
                  label="所属机构"
                  type="tree"
                  lg={24}
                  treeData={treeDate}
                  rules={[{ required: true, message: '请选择所属机构' }]}
                ></ModifyItem>
              </Row>
              <Row gutter={24}>
                <ModifyItem
                  {...baseFormProps}
                  field="name" 
                  label="关联员工"
                  type="autoComplete"
                  onSearch={searchName}
                  items={names}
                  onSelect={onSelect}
                ></ModifyItem>

                {getFieldDecorator('sourceId', {
                  initialValue: initData.sourceId,
                })(
                  <input type='hidden' />
                )}

                <ModifyItem
                  {...baseFormProps}
                  field="account"
                  label="用户名"
                  // rules={[{ required: true, message: '请输入用户名' }]}
                  rules={[{ required: true, message: '请输入用户名' }, { validator: checkAccountExist }]}
                ></ModifyItem>
              </Row>


            </div>


          }

          {/* <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              field="password" 
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            ></ModifyItem>
            <ModifyItem
              {...baseFormProps}
              type="radio"
              field="expMode"
              label="有效期"
              items={expModes}
              onChange={(e) => setShowTime(e === 2)}
            ></ModifyItem>
            {showTime ? (
              <ModifyItem
                {...baseFormProps}
                field="expDate"
                label="有效期限"
                type="date"
              ></ModifyItem>
            ) : null}
          </Row>  */}

          <Row gutter={24}>
            <ModifyItem
              {...baseFormProps}
              lg={24}
              // wholeLine={true}
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
