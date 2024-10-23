"use client";
import { useEffect, useRef } from "react";

export default function useClickOutside(handler, ignoreRefs = []) {
    let domNode = useRef();

    useEffect(() => {
        const click = (e) => {
            if (!domNode?.current?.contains(e.target) &&
                !ignoreRefs.some((ref) => ref?.current?.contains(e.target)))
                handler();
        }

        document.addEventListener('mousedown', click)
        return () => {
            document.removeEventListener('mousedown', click)
        };
    }, [handler, ignoreRefs]);

    return domNode;
}
