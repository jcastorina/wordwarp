import _ from "lodash"

const alpha = "abcdefghijklmnopqrstuvwxyz"

export function charCompare (nameObj,userString) {

    let userObj = {}

    let i
    
    for(i of userString){

        let flag = true
        i = i.toLowerCase()

        for(let j in alpha){
            if(i === alpha[j]){
                flag = false
            }
        }

        if(flag){
            continue
        }
        if(!userObj[i]){
            userObj[i] = 0;
        } 
        userObj[i] += 1
    }

    if(_.isEqual(nameObj,userObj)){
        console.log("match")
        return true;
    }

    return false
}

export function nameObj (string) {

    let obj = {}
    
    let i    

    for(i of string){
        i = i.toLowerCase()
        let flag = true
        for(let j in alpha){
            if(i === alpha[j]){
                flag = false
            }
        }

        if(flag || i === " "){
            continue
        }

        if(!obj[i]){
            obj[i] = 0;
        } 
        obj[i] += 1
    }

    return obj
}