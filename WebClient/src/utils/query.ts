export function getQueryStringValue<Type>(query: URLSearchParams, fieldName: string, defaultValue: Type): Type {
    let value = query.get(fieldName)

    if (value && typeof defaultValue === "number") {
        let numberValue = +value

        if (isNaN(numberValue)) {
            numberValue = defaultValue
        }

        return numberValue as Type
    }

    return (value as Type) || defaultValue
}
