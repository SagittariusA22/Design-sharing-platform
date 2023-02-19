// 精品项目历史记录
export function setHistoryList( historyListKey, historyList ){
    return localStorage.setItem(historyListKey,historyList)
};

export function getHistoryList(historyListKey){
    return localStorage.getItem(historyListKey)
};

export function removeHistoryList(historyListKey){
    return localStorage.removeItem(historyListKey)
};

// 所有项目历史记录
export function setHistoryAllList( historyAllListKey, historyAllList ){
    return localStorage.setItem(historyAllListKey,historyAllList)
};

export function getHistoryAllList(historyAllListKey){
    return localStorage.getItem(historyAllListKey)
};

export function removeHistoryAllList(historyAllListKey){
    return localStorage.removeItem(historyAllListKey)
};