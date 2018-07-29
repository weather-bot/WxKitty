function translate(name) {
    switch (name) {
        case 'altocumulus':
            return "高積雲";
        case "cirrostratus":
            return "卷層雲"
        case "cirrocumulus":
            return "卷積雲"
        case "stratus":
            return "層雲"
        case "nimbostratus":
            return "雨層雲"
        case "cumulus":
            return "積雲"
        case "altostratus":
            return "高層雲"
        case "cumulonimbus":
            return "積雨雲"
        case "stratocumulus":
            return "層積雲"
        case "cirrus":
            return "卷雲"
    }
}

function main(result) {
    return `此照片為「${translate(result[0].name)}」
---
分析結果：
${translate(result[0].name)}: ${result[0].score} 
${translate(result[1].name)}: ${result[1].score} 
${translate(result[2].name)}: ${result[2].score} 
`;
}

module.exports = main;