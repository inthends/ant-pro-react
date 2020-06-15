import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 保存维保计划
export function SaveFormPlan(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/SaveFormPlan`, {data: objToFormdata(data)}).then(getResult as any);
}

//删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Maintenance/GetDataItemTreeList`, {}).then(getResult as any);
}

//获取巡检内容
export function GetPageContentListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/GetPageContentListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存维保计划点位
export function SavePlanPointForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/SavePlanPointForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取巡检路线
export function GetPageLineListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/GetPageLineListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//获取巡检路线点位明细
export function GetLinePonitPageListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/GetLinePonitPageListById`, { data: objToFormdata(data) }).then(getResult as any);;
}

// 获取巡检内容
export function GetContents(): Promise<any[]> {
  return request.get(process.env.basePath + `/Maintenance/GetContents`).then(getResult as any);
}

//保存维保设备内容
export function SaveDeviceContentForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/SaveDeviceContentForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取巡检点位的内容
export function GetPointcontentPageListByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/GetPointcontentPageListByID`, { data: objToFormdata(data) }).then(getResult as any);;
}

//删除巡检点位内容
export function RemoveLineContentPoint(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLineContentPoint?keyValue=${keyValue}`, {})
    .then(getResult as any);
}

//删除巡检点位全部内容
export function RemoveLineContentPointAll(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLineContentPointAll?keyValue=${keyValue}`)
    .then(getResult as any);
}

//删除巡检路线下的点位
export function RemoveLinePoint(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLinePoint?keyValue=${keyValue}`, {})
    .then(getResult as any);
}


//移动路线下的点位排序
export function MovePoint(keyValue,sort): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/MovePoint?keyValue=${keyValue}&sort=${sort}`, {})
    .then(getResult as any);
}

//删除巡检路线下的全部点位
export function RemoveLinePointAll(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLinePointAll?keyValue=${keyValue}`)
    .then(getResult as any);
}

//获取角色
export function GetTreeRoleJson(): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/Maintenance/GetTreeRoleJson`)
    .then(getResult as any);
}