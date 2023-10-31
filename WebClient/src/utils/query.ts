import routes from 'constants/routes';
import { createBrowserRouter, useNavigate, Location } from 'react-router-dom';

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

// export function updateQueryString(query: URLSearchParams, navigate: Navigate<unknown>, location: Location<unknown>, params: any) {

//     for (const key in params) {
//         query.set(key, `${params[key]}`)
//     }

//     history.push({
//         pathname: location.pathname,
//         search: `?${query.toString()}`
//     })
// }

