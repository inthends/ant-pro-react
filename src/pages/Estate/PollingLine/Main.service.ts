import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改巡检路线
export function SaveFormLine(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/SaveFormLine`, {data: objToFormdata(data)}).then(getResult as any);
}

//删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Polling/GetDataItemTreeList`, {}).then(getResult as any);
}

//获取巡检内容
export function GetPageContentListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/GetPageContentListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//保存巡检路线点位
export function SaveLinePointForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/SaveLinePointForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取巡检路线
export function GetPageLineListJson(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/GetPageLineListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

//获取巡检路线点位明细
export function GetLinePonitPageListById(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/GetLinePonitPageListById`, { data: objToFormdata(data) }).then(getResult as any);;
}

// 获取巡检内容
export function GetContents(): Promise<any[]> {
  return request.get(process.env.basePath + `/Polling/GetContents`).then(getResult as any);
}

//保存巡检点位内容
export function SavePointContentForm(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/SavePointContentForm`, { data: objToFormdata(data) }).then(getResult as any);
}

//获取巡检点位的内容
export function GetPointcontentPageListByID(data): Promise<any> {
  return request.post(process.env.basePath + `/Polling/GetPointcontentPageListByID`, { data: objToFormdata(data) }).then(getResult as any);;
}

//删除巡检点位内容
export function RemoveLineContentPoint(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveLineContentPoint?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//删除巡检点位全部内容
export function RemoveLineContentPointAll(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveLineContentPointAll?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//删除巡检路线下的点位
export function RemoveLinePoint(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveLinePoint?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}

//移动路线下的点位排序
export function MovePoint(keyvalue,sort): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/MovePoint?keyvalue=${keyvalue}&sort=${sort}`, {})
    .then(getResult as any);
}

//删除巡检路线下的全部点位
export function RemoveLinePointAll(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/Polling/RemoveLinePointAll?keyvalue=${keyvalue}`)
    .then(getResult as any);
}

//获取角色
export function GetTreeRoleJson(): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/Role/GetRoleListJson`)
    .then(getResult as any);
}