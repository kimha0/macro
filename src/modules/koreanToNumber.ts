import { emptyStringReplace } from "./text";

export function koreanToNumber(str: string) {
    const koreanStr = emptyStringReplace(str);
    const units = {
        "억": 100000000,
        "만": 10000,
        "관": 10000
    };

    let total = 0;
    let tempNum = 0;

    for (let i = 0; i < koreanStr.length; i++) {
        const char = koreanStr[i];

        if (char === '억' || char === '만' || char === '관') {
            tempNum = tempNum || 1;  // If there's no number preceding the unit (e.g., "억"), assume it to be 1.
            total += tempNum * units[char];
            tempNum = 0;
        } else {
            tempNum = tempNum * 10 + parseInt(char, 10);
        }
    }

    return total + tempNum; // Add any remaining number (e.g., the "2500" in "12억5000만2500")
}
