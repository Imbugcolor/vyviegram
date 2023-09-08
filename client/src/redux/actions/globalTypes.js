export const GLOBALTYPES = {
    AUTH: "AUTH",
    UPDATE_TOKEN: "UPDATE_TOKEN",
    ALERT: "ALERT",
    THEME: "THEME",
    STATUS: 'STATUS',
    MODAL: 'MODAL',
    SOCKET: 'SOCKET',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    CALL: 'CALL',
    PEER: 'PEER',
    SHARE: 'SHARE',
    ADMIN_DELETE_POST: 'ADMIN_DELETE_POST',
    REPORT_POST: 'REPORT_POST'
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}