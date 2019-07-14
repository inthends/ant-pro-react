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
 * 费项表
 */
export interface FeeItemEntity { 
    /**
     * 费项ID
     */
    feeItemID?: string;
    /**
     * 费项种类
     */
    feeKind?: string;
    /**
     * 费项类别
     */
    feeType?: string;
    /**
     * 系统类别
     */
    sysType?: string;
    /**
     * 费项名称
     */
    feeName?: string;
    /**
     * 费项英文名称
     */
    feeEngName?: string;
    /**
     * 费项编号
     */
    feeCode?: string;
    /**
     * 费项序号
     */
    feeNo?: number;
    /**
     * 费项性质
     */
    feeNature?: string;
    /**
     * 开票项目
     */
    feeInvoice?: string;
    /**
     * 开票编号
     */
    feeInvoiceNo?: string;
    /**
     * 单价
     */
    feePrice?: number;
    /**
     * 币种
     */
    currency?: string;
    /**
     * 计算中间结果小数位
     */
    midResultScale?: number;
    /**
     * 中间结果最后一位小数处理方法
     */
    midScaleDispose?: number;
    /**
     * 单价*用量结果小数位
     */
    calResultScale?: number;
    /**
     * 单价*用量结果最后一位小数处理方法
     */
    calScaleDispose?: number;
    /**
     * 最终结果结果小数位
     */
    lastResultScale?: number;
    /**
     * 最终结果最后一位小数处理方法
     */
    lastScaleDispose?: number;
    /**
     * 类别编号
     */
    typeCode?: string;
    /**
     * 关联收费项目
     */
    linkFee?: string;
    /**
     * 计费起始日期
     */
    beginDate?: Date;
    /**
     * 计费终止日期
     */
    endDate?: Date;
    /**
     * 计费周期
     */
    cycleValue?: number;
    /**
     * 计费周期类型
     */
    cycleType?: string;
    /**
     * 计费起止日期不允许为空
     */
    isNullDate?: boolean;
    /**
     * 允许在合同中添加
     */
    isInContract?: boolean;
    /**
     * 不允许临时加费
     */
    isTemp?: boolean;
    /**
     * 减免费项
     */
    isCancel?: boolean;
    /**
     * 含税单价
     */
    isTax?: boolean;
    /**
     * 是否停用
     */
    isEnable?: boolean;
    /**
     * 临时加费不允许修改单价
     */
    isEditTemp?: boolean;
    /**
     * 是否允许修改计费起止日期
     */
    isModifyDate?: boolean;
    /**
     * 是否自定义起止日期
     */
    isCustomizeDate?: boolean;
    /**
     * 备注
     */
    memo?: string;
    createDate?: Date;
    createUserId?: string;
    createUserName?: string;
    modifyDate?: Date;
    modifyUserId?: string;
    modifyUserName?: string;
}
