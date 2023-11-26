const getCookies = (req) => {
    let cookies = {}
    const {
        headers: { cookie },
    } = req
    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=')
            return { ...res, [data[0]]: data[1] }
        }, {})
        cookies = values
    }
    return cookies
}

module.exports = getCookies
