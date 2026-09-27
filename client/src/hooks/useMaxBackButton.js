import { useEffect } from "react";
import Max from "../services/Max/Max";

const max = new Max();

export default function useMaxBackButton(onBack) {
    useEffect(() => {
        max.showBackButton(onBack);
        return () => max.hideBackButton(onBack);
    }, [onBack]);
}
