import request from "../request"

export function getArticles(query, page) {
    return request({
        url: '/articles',
        method: 'post',
        data: {
            page: page.page,
            pageSize: page.pageSize,
            tagId: query.tagId,
            categoryId: query.categoryId
        }
    })
}
export function getSearchArticles(keyword, page) {
    return request({
        url: `/articles/search/${keyword}/${page.pageNo}/${page.pageSize}`,
        method: 'post',
    })
}

export function viewArticle(id) {
    return request({
        url: `/articles/view/${id}`,
        method: 'post'
    })
}

export function getHotArticles() {
    return request({
        url: '/articles/hot',
        method: 'post'
    })
}

export function getNewArticles() {
    return request({
        url: '/articles/new',
        method: 'post'
    })
}

export function getArticlesByCategory(id) {
    return request({
        url: `/articles/category/${id}`,
        method: 'post'
    })
}

export function getArticlesByTag(id) {
    return request({
        url: `/articles/tag/${id}`,
        method: 'post'
    })
}


export function publishArticle(article,token) {
    return request({
        headers: {'Authorization': token},
        url: '/articles/publish',
        method: 'post',
        data: article
    })
}

export function listArchives() {
    return request({
        url: '/articles/listArchives',
        method: 'post'
    })
}

export function getArticleById(id) {
    return request({
        url: `/articles/${id}`,
        method: 'post'
    })
}

export function getArticleByUserId(userId) {
    return request({
        url: `/articles/findArticle/${userId}`,
        method: 'post'
    })
}
