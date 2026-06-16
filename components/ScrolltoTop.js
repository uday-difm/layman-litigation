'use client'

import { ArrowUp } from "lucide-react";

const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

const ScrollToTop = () => {
    return <button
        onClick={scrollToTopHandler}
        className="flex fixed bottom-4 right-4 h-9 w-9 items-center justify-center rounded bg-[#d9b04f] text-black transition-colors hover:bg-[#c9a03f]"
        aria-label="Scroll to top"
    ><ArrowUp /></button>
}

export default ScrollToTop;