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
 * 树
 */
export interface TreeEntity {
    /**
     * parentId
     */
    parentId?: string;
    /**
     * 主键
     */
    key?: string;
    /**
     * 
     */
    title?: string;
    /**
     * 
     */
    type?: string;
    /**
     * 是否子节点
     */
    isLeaf?: boolean;
    /**
     * 
     */
    value?: string;
    //是否可用
    disabled?: boolean;

    /**
     * 子节点
     */
    children?: Array<TreeEntity>;
}
