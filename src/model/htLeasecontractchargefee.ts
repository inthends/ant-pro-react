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
 * 合同条款
 */
export interface HtLeasecontractchargefee {
    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // billType?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    rentalPeriodDivided?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:False
     */
    leaseContractChargeId?: string;


    /**
     * Desc:递增类型  Default:  Nullable:True
     */
    increType?: string;

    /**
     * Desc:  Default:  Nullable:True
     */
    increPrice?: number;

    /**
     * Desc:  Default:  Nullable:True
     */
    increPriceUnit?: string;

    // /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // startDate?: Date;
    //  /**
    //  * Desc:  Default:  Nullable:True
    //  */
    // endDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:0  Nullable:True
     */
    yearDays?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    dayPriceConvertRule?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
   
    /**
     * Desc:  Default:0  Nullable:True
     */
    payCycle?: number;
  
     /**
     * Desc:  Default:  Nullable:True
     */
    feeItemId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    price?: number;
      /**
     * Desc:  Default:0  Nullable:True
     */
    advancePayTime?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    advancePayTimeUnit?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeItemName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    priceUnit?: string;
}
