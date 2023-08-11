import { Config } from "./Config";
import { MainApi } from "./MainAPi.js";
import {postMethod, patchMethod, getMethod, deleteMethod  } from "./request";
import mutationsType from "../util/mutationsType";

/**
 * 
 */
 export class EquityApi extends MainApi {

    /**
     * @param {Config} config
     * @param {string} resourceName
     */
    constructor( config) {

        let resourceName = "/transactions"

        super(resourceName, config)

    }
    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameAll() {
        return mutationsType.SET_TRANSACTIONS
    }
    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameCreate() {
        return mutationsType.ADD_TRANSACTION
    }
    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameUpdate() {
        return mutationsType.UPDATE_TRANSACTION
    }

}