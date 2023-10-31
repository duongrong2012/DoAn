import React from "react";
import { useLocation } from "react-router-dom";

export default function useQuery() {
    const { search } = useLocation(); //lay het sau ?(bao gom ca dau ?)

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
