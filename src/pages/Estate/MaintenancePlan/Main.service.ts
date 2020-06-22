import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 保存维保计划
export function SaveFormPlan(data): Promise<any> {
  return request.post(process.env.basePath + `/Maintenance/SaveFormPlan`, {data: objToFormdata(data)}).then(getResult as any);
}

//删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveForm?keyvalue=${keyvalue}`, {})
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
export function RemoveLineContentPoint(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLineContentPoint?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//删除巡检点位全部内容
export function RemoveLineContentPointAll(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLineContentPointAll?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除巡检路线下的点位
export function RemoveLinePoint(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLinePoint?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}


//移动路线下的点位排序
export function MovePoint(keyvalue,sort): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/MovePoint?keyvalue=${keyvalue}&sort=${sort}`, {})
    .then(getResult as any);
}

//删除巡检路线下的全部点位
export function RemoveLinePointAll(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Maintenance/RemoveLinePointAll?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//获取角色
export function GetTreeRoleJson(): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/Maintenance/GetTreeRoleJson`)
    .then(getResult as any);
}