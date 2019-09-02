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
 * 
 */
export interface CwFeeitemDetail {
    /**
     * Desc:  Default:0  Nullable:False
     */
    accBillDateNum?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    bankTransfer?: boolean;
    /**
     * Desc:  Default:0.0000  Nullable:False
     */
    delayRate?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    inMethod?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:0  Nullable:True
     */
    payDeadlineFixed?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    useInOrOut?: boolean;
    /**
     * Desc:  Default:0  Nullable:False
     */
    accBillDateUnit?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    copePersonType?: number;
    /**
     * Desc:  Default:0  Nullable:True
     */
    delayType?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    inOutDate?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    payDeadlineNum?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    useStepPrice?: boolean;
    /**
     * Desc:  Default:1  Nullable:False
     */
    accPeriodBase?: number;
    /**
     * Desc:  Default:1.0000  Nullable:False
     */
    copeRate?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeApportion?: string;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    lateDataNotIn?: boolean;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    payDeadlineUnit?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    accPeriodBaseNum?: number;
    copeUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeFormulaOne?: string;
    /**
     * Desc:  Default:1  Nullable:False
     */
    lateStartDateBase?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    outFeeMethod?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    payedCreateCope?: boolean;
    /**
     * Desc:  Default:0  Nullable:False
     */
    accPeriodBaseUnit?: number;
    /**
     * Desc:指定对象名称  Default:  Nullable:True
     */
    copeUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeFormulaTwo?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    lateStartDateFixed?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    outMethod?: number;
    payFeeItemId?: string;
    /**
     * Desc:  Default:1  Nullable:False
     */
    accRightBase?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    feeItemId?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    lateStartDateNum?: number;
    /**
     * Desc:  Default:1  Nullable:True
     */
    payDateNum?: number;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    splitFee?: boolean;
    /**
     * Desc:  Default:1  Nullable:False
     */
    accBillDateBase?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    accRightBaseNum?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    lateStartDateUnit?: number;
    /**
     * Desc:  Default:0  Nullable:True
     */
    payDateUnit?: number;
    stepPriceId?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    accBillDateFixed?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    accRightBaseUnit?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:0  Nullable:False
     */
    inFeeMethod?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    memo?: string;
    /**
     * Desc:  Default:1  Nullable:False
     */
    payDeadlineBase?: number;
    /**
     * Desc:  Default:0  Nullable:False
     */
    useFormulaTwo?: number;
}
