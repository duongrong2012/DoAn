export function getQueryStringValue(query, fieldName, defaultValue) {
    let value = query.get(fieldName)

    if (value && typeof defaultValue === "number") {
        let numberValue = +value

        if (isNaN(numberValue)) {
            numberValue = defaultValue
        }

        return numberValue
    }

    return (value) || defaultValue
}

export function updateQueryString(query, history, location, params) {
    for (const key in params) {
        query.set(key, `${params[key]}`)
    }

    history.push({
        pathname: location.pathname,
        search: `?${query.toString()}`
    })
}

