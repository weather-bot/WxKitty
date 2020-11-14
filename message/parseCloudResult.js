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

function introduce(name) {
    switch (name) {
        case 'altocumulus':
            return "形態多變的一種雲種，有時呈扁圓狀的棉花球、有時呈網狀、有時呈鱗片狀、有時為薄薄一片片的。是預示晴天的指標，如諺語「瓦塊雲，曬死人」。\n查看更多： https://rb.gy/mk1i6r";
        case "cirrostratus":
            return "一片淺白色及帶透明的層狀雲。因為是很薄的雲層，透過它仍可清晰看到太陽和月亮的輪廓。\n查看更多： https://rb.gy/3buqdp"
        case "cirrocumulus":
            return "透光性高、薄而透明、雲塊很小，很像細片魚鱗或許多白色顆粒。諺語「魚鱗天，不雨也風顛」，預示著不是下雨就是刮大風，壞天氣即將來到。\n查看更多： https://rb.gy/fudmee"
        case "stratus":
            return "一片平均白色或灰白色無形狀，看似霧的雲以均勻的霧狀擴散開來。雲處於低空，並且通常很薄，有時可以帶來毛毛細雨。\n查看更多： https://rb.gy/yilb4f"
        case "nimbostratus":
            return "通常呈暗灰色，為一大片布滿全天及很厚的降水性雲層，並完全遮蓋太陽。雨層雲常帶來連續性的降雨。\n查看更多： https://rb.gy/1ygoaq"
        case "cumulus":
            return "體積和形狀皆是千變萬化，常見於夏季。有時像是饅頭的雲塊，諺語「饅頭雲，天氣晴」，預示天氣持續晴朗，大氣很穩定。\n查看更多： https://rb.gy/fxkbxy"
        case "altostratus":
            return "一大片的雲，常呈灰白、灰色或微帶藍色。可能帶來連續性的雨，常在冷鋒或低壓靠近的時候出現。\n查看更多： https://rb.gy/mu5vrz"
        case "cumulonimbus":
            return "垂直發展的雲層，可能夾帶閃電與暴雨。常見於炎熱的夏天，俗稱午後雷陣雨。\n查看更多： https://rb.gy/lvuu7i"
        case "stratocumulus":
            return "層積雲予人的感覺是連綿不斷、完整無缺的一整片雲，雲與雲之間的空隙非常細小，像塊大棉被蓋著我們一樣。\n查看更多： https://rb.gy/3ua3tk"
        case "cirrus":
            return "絲縷狀的結構，及柔絲般的光澤，分離散亂。顏色以白色為主。常呈不同形狀，如絲狀、毛狀、鉤狀等。卷雲出現代表高空氣流強盛。\n查看更多： https://rb.gy/ss1mh8"
    }
}

function main(result) {
    return `此照片為「${translate(result[0].name)}」
---
雲種介紹：
${introduce(result[0].name)}
---
分析結果：
${translate(result[0].name)}: ${result[0].score}
${translate(result[1].name)}: ${result[1].score}
${translate(result[2].name)}: ${result[2].score}`;
}

module.exports = main;
