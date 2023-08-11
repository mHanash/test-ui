
import {postMethod, patchMethod, getMethod, deleteMethod, postMethodMultiPart  } from "./request";
import { Config } from "./Config";
/**
 * 
 */
export class MainApi {

    /**
     * @param {String} resourceName
     * @param {Config} config
     */
    constructor(resourceName = null, config) {

        if (config === undefined || config === null ) {
            throw Error("Argument error Api wrapper")
        }
        this._resourceName = resourceName
        this._config = config

    }

    /**
     * @return {Config}
     */
    get config() {
        return this._config
    }

    /**
     * @return {String}
     */
    get baseUrl() {

        // let host = process.env.VUE_APP_API_HOST
        let host = '127.0.0.1:8000'
        
        if (typeof host == "string") {
            host = host.trim()
        }

        if (!host) {
            host = ""
        }

        let url = host + "/api"

        if (this._resourceName) {
            url = url  + this._resourceName 
        }

        return url
    }
    /**
     * 
     */
    get resourceName() {
        return this._resourceName
    }
    /**
     * 
     * @return {*} 
     */
    get headers() {
        return {
            "Content-Type" : this.contentType,
            "X-Api-Key" : "e16a4a08-c7c8-4091-9989-73f320162a30",
        }
    }
    /**
     * 
     * @returns {string}
     */
    get contentType() {
        return "application/json"
    }

    /**
     * 
     */
    async get(id) {

        try {
            let {data} =  await getMethod(this.baseUrl+`/${id}`, this.headers) 
            this.storeByUpdate(data)    
            return data      
        } catch (err) {
            await this.errorResolver(err)
        }

    }

    /**
     * 
     */
    async all() {

        try {
            let {data} = await getMethod(this.baseUrl, this.headers)

            this.storeByGetAll(data)

            return data

        } catch (err) {
            await this.errorResolver(err)
        }

    }
    //postMethodMultiPart
    /**
     * 
     */
    async createMultiPart(atts) {
        //console.log("ffff")

        try {
            let {data} = await postMethodMultiPart(this.baseUrl, atts, this.headers)
            //console.log(data)
            this.storeByCreate(data)
            return data

        } catch (err) {
            console.log(err)
            await this.errorResolver(err)
        }

    }

    /**
     * 
     */
    async create(atts) {
        //console.log("ffff")

        try {
            let {data} = await postMethod(this.baseUrl, atts, this.headers)
            //console.log(data)
            this.storeByCreate(data)
            return data

        } catch (err) {
            console.log(err)
            await this.errorResolver(err)
        }

    }

    /**
     * 
     */
     async update(id, atts) {
        try {
            let url = this.baseUrl + "/"+id
            let {data} = await patchMethod(url, atts, this.headers)
            //console.log(data)
            this.storeByUpdate(data)
            return data

        } catch (err) {
            console.log(err)
            await this.errorResolver(err)
        }
    }

    /**
     * 
     */
    async delete(id) {
        //#fefefe
        //#f6f6f6
    }

    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameAll() {
        return ''
    }
    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameCreate() {
        return ''
    }
    /**
     * 
     * @return {String}  
     */
    get mitationMethodNameUpdate() {
        return ''
    }
    /**
     * 
     * @param {*} data 
     * @returns 
     */
     storeByCreate(data) {
        //console.log(data)
        this.config.store.commit(this.mitationMethodNameCreate, data)
    }
    
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    storeByUpdate(data) {
        this.config.store.commit(this.mitationMethodNameUpdate, data)
        //this.storeByCreate(data)
    }
    /**
     * 
     * @param {*} data 
     * @returns 
     */
    storeByGetAll(data) {
        //console.log(this.config.store)

        this.config.store.commit(this.mitationMethodNameAll, data)
        //console.log(data)
    }


    /**
     * 
     */
     async errorResolver(err) {

        let res = err.response

        console.log(err)

        if(res.status == 401 /*|| res.status == 403*/){
            
            this.config.store.commit('setToken', null)
            this.config.router.push({
                name:"login"
            })

        }
        else if (res.status == 403) {
                        
            let errors =  {
                        detail:["Access denied"]
            };

            throw this.errorsNormalized({errors});
            
        }
        else if(!res.status || (500 > res.status && res.status >= 400)){
            //console.log("eerrr")
            //throw res.data;
            let errors
            console.log(res.data)


            if (res.data.errors) {

                errors = res.data.errors
            }else{
                errors = res.data
            }

            //console.log(errors)

            throw this.errorsNormalized(errors);


        }else{

            let errors =  {
                        detail:["Internal Error"]
            };

            throw this.errorsNormalized({errors});

        }
    }
    /**
     * 
     */
    errorsNormalized(err) {
        return err
       /*return Object.keys(err)
            .reduce(
                (prev, keyErr) => {
                    let itErr = err[keyErr]
                    let label = itErr.label ? itErr.label : keyErr;
                    //[keyErr].

                    return prev + ` ${label} : ${itErr.messages.shift(err)} |\n`
                },
                ""
            )*/
    }
}