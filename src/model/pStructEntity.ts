/**
 * A6物业管理系统接口
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


/**
 * 房产结构表
 */
export interface PStructEntity {
    /**
     * 房产主键
     */
    id?: string;
    /**
     * 组织机构Id
     */
    organizeId?: string;
    /**
     * 房产父id
     */
    parentId?: string;
    /**
     * 房产编码（用户可编辑）
     */
    code?: string;
    /**
     * 房产名称
     */
    name?: string;
    /**
     * 全Code
     */
    allCode?: string;
    /**
     * 全名称
     */
    allName?: string;
    /**
     * 房产类别 1-楼盘 2-楼栋 4-楼层 5-房间 6-公共部位 8-车库，9-车位
     */
    type?: number;

    /**
    * 建筑面积
    */
    area?: number;
    /**
     * 占地面积
     */
    coverArea?: number;

    /**
     * 主图
     */
    mainPic?: string;

    /**
     * 电话号码
     */
    phoneNum?: string;

    /**
       * 绿化面积
       */
    greenArea?: number;
    /**
     * 容积率
     */
    volumeRate?: number;
    /**
     * 绿化率
     */
    greenRate?: number;
    province?: string;
    city?: string;
    region?: string;

    /**
       * 楼盘地址
       */
    address?: string;

    lon?: string;
    lat?: string;
    propertyType?: string;
    /**
     * 建成年份
     */
    createYear?: Date;
    /**
     * 开发商
     */
    developerName?: string;
    /**
     * 物业公司
     */
    propertyCompany?: string;
    /**
     * 物业费标准
     */
    feeItemRule?: string;

    /**
    * 状态 -1删除，0-未售（默认状态）1-待交房 2-装修 3-空置 4-出租 5-自用
    */
    state?: number;

    /**
    * 业主
    */
   ownerId?: string;

   /**
    * 业主
    */
   ownerName?: string;

      /**
    * 租户
    */
   tenantId?: string;

      /**
    * 租户
    */
   tenantName?: string;

    /**
    * 备注
    */
    memo?: string;
}
