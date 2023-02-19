// token的有关方法
export function setToken( tokenKey, token ){
    return localStorage.setItem(tokenKey,token)
};

export function getToken(tokenKey){
    return localStorage.getItem(tokenKey)
};

export function removeToken(tokenKey){
    return localStorage.removeItem(tokenKey)
};

// username
export function setUserName( UserNameKey, UserName ){
    return localStorage.setItem(UserNameKey,UserName)
};

export function getUserName(UserNameKey){
    return localStorage.getItem(UserNameKey)
};

export function removeUserName(UserNameKey){
    return localStorage.removeItem(UserNameKey)
};