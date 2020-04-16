/**
 * A6资产管理系统接口
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
 * 费用明细
 */
export interface HtChargefeeresult {
    /**
    * Desc:  Default:  Nullable:False
    */
    id?: string;
    /**
    * Desc:  Default:  Nullable:False
    */
    leaseContractChargeId?: string;
    /**
   * Desc:  Default:  Nullable:True
   */
    beginDate?: Date;
    /**
   * Desc:  Default:  Nullable:True
   */
    endDate?: Date;
    /**
   * Desc:  Default:  Nullable:True
   */
    feeItemId?: string;
    /**
   * Desc:  Default:  Nullable:True
   */
    feeItemName?: string;

    /**
     * Desc:  Default:  Nullable:True
    */
    period?: Date;

    /**
   * Desc:  Default:  Nullable:True
  */
    billDate?: Date;

    /**
   * Desc:  Default:  Nullable:True
  */
    deadline?: Date;

    /**
    * Desc:  Default:  Nullable:True
    */
    price?: number;

    /**
    * Desc:  Default:  Nullable:True
    */
    priceUnit?: string;

    /**
    * Desc:  Default:  Nullable:True
    */
    quantity?: number;

    /**
    * Desc:  Default:  Nullable:True
    */
    totalPrice?: number;

    /**
 * Desc:费用类型，1保证金2租金  Default:  Nullable:True
 */
    feeType?: number;

    /**
   * Desc:  Default:  Nullable:True
   */
    createDate?: Date;

    /**
    * Desc:  Default:  Nullable:True
    */
    createUserId?: string;

    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;

    /**
   * Desc:  Default:  Nullable:True
   */
    modifyDate?: Date;

    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;

    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;  

      /**
     * Desc:  是否免租期
     */
    isReduction?: boolean;
}
