'use strict'
const specialCharactersArray =  [',','$','!','@','#','$','%','^','&','*'];

const isValidName = (name) => {
    if(!isNaN(name)) return false;
    if(!name || name.length==0 || name.length > 100) return false;
    for(let i=0;i<name.length;i++)
    {
        if(specialCharactersArray.includes(name[i])) {
            return false;
        }
    }
    return true;
}

const isValidLongDesp = (desp) => {
    if(!isNaN(desp)) return false;
    if(desp.length > 500) return false;
    for(let i=0;i<desp.length;i++)
    {
        if(specialCharactersArray.includes(desp[i])) {
            return false;
        }
    }
    return true;
}
const isValidShortDesp = (desp) => {
    if(!isNaN(desp)) return false;
    if(desp.length > 100) return false;
    for(let i=0;i<desp.length;i++)
    {
        if(specialCharactersArray.includes(desp[i])) {
            return false;
        }
    }
    return true;
}

const isValidURL = (url) => {
    if(!isNaN(url)) return false;
    const newUrl = new URL(url);
    if(newUrl.protocol=='http:' || newUrl.protocol=='https:') {
        return true;
    } 
    else return false;
}


const isValidKeys= (productInput) =>{
    const keys=["name","visit_url","icon_url","long_desp","short_desp","created_by","updated_by","comments","upvote","tags"] //required keys
    let inputKeys = Object.keys(productInput);
    // console.log(inputKeys);
    for(let i=0;i<inputKeys.length;i++)
    {
        if(!keys.includes(inputKeys[i])) return false;
    }
    return true;
}



const isValidInputProduct=(productInput)=>{
    if(!isValidKeys(productInput)) 
    {
        return "Invalid Keys";
    }
    else if(!isValidName(productInput["name"])) 
    {
        return "Invalid name field";
    }
    else if(!isValidShortDesp(productInput["short_desp"]))
    {
        return "Invalid short description";
    }
    else if(!isValidLongDesp(productInput["long_desp"]))
    {
        return "Invalid long description";
    } 
    else if(!isValidURL(productInput["icon_url"]))
    {
        return "Invalid Url";
    }
    else if(!isValidURL(productInput["visit_url"]))
    {
        return "Invalid Url";
    }
    return;

}

module.exports = {isValidInputProduct};