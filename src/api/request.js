import axios from "axios"

export let getMethod = async (url, headers) => {

    let callable = () => {

            let data = axios.get(url, {headers})
            return data
    }

    let res = await executeMulti(callable)

    if (res.data) {
        return res.data
    } else if(res.error) {
        throw res.error
    }
    else {
        throw {
            response:{
                data:{
                    errors :{
                        message:"Error"
                    }
                }
            }
        }
    }

}

export let postMethod = async (url, formData, headers) => {

    let callable = () => {

            
            let data = axios.post(url, formData, {headers})
            return data
    }

    let res = await executeMulti(callable)

    if (res.data) {
        return res.data
    } else if(res.error) {
        throw res.error
    }
    else {
        throw {
            response:{
                data:{
                    errors :{
                        message:"Error"
                    }
                }
            }
        }
    }

}


export let postMethodMultiPart = async (url, formData, headers) => {

    let callable = () => {

            let formDataMilti = new FormData()

            Object.keys(
                formData
            ).forEach(
                key => {
                    formDataMilti.append(
                        key,
                        formData[key]
                    )
                }
            )
            
            let data = axios.post(url, formDataMilti, {headers})
            return data
    }

    let res = await executeMulti(callable)

    if (res.data) {
        return res.data
    } else if(res.error) {
        throw res.error
    }
    else {
        throw {
            response:{
                data:{
                    errors :{
                        message:"Error"
                    }
                }
            }
        }
    }

}


export let deleteMethod = async (url, headers) => {


    let callable = () => {
                    
            let data = axios.delete(url, {headers})
            return data
    }

    let res = await executeMulti(callable)

    if (res.data) {
        return res.data
    } else if(res.error) {
        throw res.error
    }
    else {
        throw {
            response:{
                data:{
                    errors :{
                        message:"Error"
                    }
                }
            }
        }
    }

}


export let patchMethod = async (url, formData, headers) => {

    //headers["Content-Type"] = "application/merge-patch-json" 
    let callable = () => {

                
            let data = axios.put(url, formData, {headers})
            return data
    }

    let res = await executeMulti(callable)

    if (res.data) {
        return res.data
    } else if(res.error) {
        throw res.error
    }
    else {
        throw {
            response:{
                data:{
                    errors :{
                        message:"Error"
                    }
                }
            }
        }
    }

}

/**
 * 
 * @param {Callable} callable 
 */
 let executeMulti = (callable) => {

        return new Promise(

            (resolve, reject) => {

 
                execute(callable, resolve, 0, 3)

                //console.log("callable")


            }

        )

}
/**
 * 
 * @param {Callable} callable 
 * @param {*} resolve 
 * @param {*} shotCount 
 * @param {*} shot 
 */
const  execute = async (callable, resolve, shotCount=0, shot=3) => {
    try {
        //console.log("data##########")
        let promise = callable()
        let data = await promise
        resolve({data})
        
    } catch (error) {
        if (error.response) {
            //console.log(error.response)
            //error
             resolve({error})
        }else if (shot > shotCount) {
            setTimeout(
                async (execute2, callable2, resolve2, shotCount2, shot2) => {
                    await execute2(callable2, resolve2, shotCount2+1, shot2)
                },
                500,
                execute, callable, resolve, shotCount, shot
            )
            //await execute(callable, resolve, shotCount+1, shot)
        }
        else {
            error = {
                response:{
                    data:{
                        errors :{
                            message:["network Error"]
                        }
                    }
                }
            }
            resolve({error})
        }
    }   
}