import { ref } from "vue";
import axios from "axios";

export function useCreateTransaction()
{
    const loading = ref(false)
    const statusCode = ref(0)
    const transaction = ref({
            "paymentMethodExp": {
              "name": "EquityBCDC",
              "paymentMethodId": "EquityBCDC"
            },
            "paymentMethodDest": {
              "name": "EquityBCDC",
              "paymentMethodId": "EquityBCDC"
            },
            "amount": "",
            "client": {
              "clientReferenceId": "1"
            },
            "currencyExp": {
              "shortName": "USD",
              "code": "904"
            },
            "currencyDest": {
              "shortName": "USD",
              "code": "904"
            },
            "createdAt": "2023-06-29T12:23:41.096Z",
            "lg_operation": "",
            "financialActorExpedition": {
              "firstName": "",
              "lastName": "",
              "email": "",
              "country": "",
              "city": "",
              "cards": [
                {
                  "number": "",
                  "yearExpiration": 0,
                  "monthExpiration": 0
                }
              ],
              "phones": [
                {
                  "number": ""
                }
              ],
                "countryCode": 243,
                "address1": "",
                "address2": "",
                "locality": ""
            },
            "financialActorDestination": {
              "firstName": "Joe",
              "lastName": "Doe",
              "email": "joe@gmail.com",
              "country": "CD",
              "city": "CD-KN",
              "cards": [
                {
                  "number": "4111111111111111",
                  "yearExpiration": 2021,
                  "monthExpiration": 12
                }
              ],
              "phones": [
                {
                  "number": "243818674267"
                }
              ],
            "countryCode": 243,
            "address1": "Kinshasa",
            "address2": "",
            "locality": "lemba" //commune
            }
        })
        let response = ref({})

    const createTransaction = async ()=>{
        loading.value = true
        console.log(transaction.value)
        transaction.value.destInfo = transaction.value.expedInfo
        response.value =await postTransaction(transaction.value)
        statusCode.value = 1
        loading.value = false
    }

    return {
        loading,
        response,
        statusCode,
        transaction,
        createTransaction
    }
}

async function postTransaction(data)
{
    const headers = {
        "Content-Type" : "application/json",
        "X-Api-Key" : "e16a4a08-c7c8-4091-9989-73f320162a30",
        "Accept" : "*/*",
    }
    let response =  axios.post('http://127.0.0.1:8000/api/transactions',
            data,
            {
                headers: headers
            }
        )
        .then(response => {
            return response
        })
        .catch(error => {
            return error
        })
        return response
}
