'use client'

import { ArrowUp } from "lucide-react";

const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

const ScrollToTop = () => {
    return <button
        onClick={scrollToTopHandler}
        className="fixed bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-[var(--ll-radius-sm)] bg-[var(--ll-ink)] text-[var(--ll-gold)] hover:bg-[var(--ll-gold)] hover:text-[var(--ll-ink)] shadow-[var(--ll-shadow-lift)] transition-all duration-200 hover:-translate-y-px active:translate-y-0"
        aria-label="Scroll to top"
    ><ArrowUp /></button>
}

export default ScrollToTop;