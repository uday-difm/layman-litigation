"use client";

import { useEffect, useState } from "react";

export function useStickyHeader() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setIsSticky(window.scrollY > 120);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return isSticky;
}