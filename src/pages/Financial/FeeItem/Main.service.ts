import { TreeEntity } from '@/model/models';
import { getResult, objToFormdata } from '@/utils/networkUtils';
import request from '@/utils/request';
import { CwFeeitem } from '@/model/cwFeeitem';

//获取全部费项
export function GetFeeTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FeeItems/GetFeeTreeList`, {}).then(getResult as any);
}
export function GetPageListJson(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/GetPageListJson`, { data: objToFormdata(data) }).then(getResult as any);
}

// 获取费项信息
export function GetFormJson(keyValue): Promise<CwFeeitem> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

// 获取房屋费项信息
export function GetHouseFormJson(keyValue): Promise<any> {
  return request
    .get(process.env.basePath + `/FeeItems/GetHouseFormJson?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取所有费项
export function GetAllFeeItems(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetAllFeeItems`)
    .then(getResult as any);
}

export function GetOrganizePageList(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/GetOrganizePageList`, { data: objToFormdata(data) }).then(getResult as any);
}

export function GetUnitFeeItemData(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/GetUnitFeeItemData`, { data: objToFormdata(data) }).then(getResult as any);
}

export function OrganizeSaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/OrganizeSaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}
//费项保存
export function SaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/SaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}
//开票项目保存
export function OrganizeEditForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/OrganizeEditForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//删除费项组织机构
export function OrganizeRemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/OrganizeRemoveForm?keyValue=${data}`, {}).then(getResult as any);
}

//删除优惠政策
export function RebateRemoveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/RebateRemoveForm?keyValue=${data}`, {}).then(getResult as any);
}

//删除已设费房屋/FeeItems/
export function HouseRemoveForm(data: any): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/HouseRemoveForm`, { data: objToFormdata(data) }).then(getResult as any);
}
//删除费项/FeeItems/

export function RemoveForm(data: any): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/RemoveForm?keyValue=${data}`, {}).then(getResult as any);
}
//房屋费项保存
export function UnitFeeSaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/UnitFeeSaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}
//费项已设房屋保存
export function HouseSaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/HouseSaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//加载税项
export function GetOrgTaxTateFormJson(data): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetOrgTaxTateFormJson?keyValue=${data}`)
    .then(getResult as any);
}

//费项机构已选ID
export function GetOrganizeForm(data): Promise<any[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetOrganizeForm?feeItemId=${data}`)
    .then(getResult as any);
}

//收款后生成应付款
export function GetFeeItemNames(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetFeeItemNames`)
    .then(getResult as any);
}
//
export function GetOrgAndBulidingTree(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetOrgAndBulidingTree`)
    .then(getResult as any);
}

//删除已设费房屋/FeeItems/
export function HouseAllRemoveForm(data: any): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/HouseAllRemoveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//优惠政策选择到楼栋
export function GetRebateOrgTree(): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetRebateOrgTree`)
    .then(getResult as any);
}

//获取优惠政策
export function GetRebatePageList(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/GetRebatePageList`, { data: objToFormdata(data) }).then(getResult as any);
}

//优惠机构已选Id
export function GetRebateOrgId(data): Promise<any[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetRebateOrgId?FeeItemId=${data}`)
    .then(getResult as any);
}

//保存优惠政策
export function RebateSaveForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/RebateSaveForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//加载优惠政策
export function GetRebateFormJson(data): Promise<TreeEntity[]> {
  return request
    .get(process.env.basePath + `/FeeItems/GetRebateFormJson?keyValue=${data}`)
    .then(getResult as any);
}

//编辑优惠政策
export function RebateEditForm(data): Promise<any> {
  return request.post(process.env.basePath + `/FeeItems/RebateEditForm`, { data: objToFormdata(data) }).then(getResult as any);
}