import request from "../request";

export function updateAvatar(formdata,token) {
    return request({
        headers: {'Content-Type': 'multipart/form-data'},
        url: `/users/avatar/${token}`,
        method: 'post',
        data: formdata
    })
}