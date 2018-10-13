function parseComfort(T, RH) {
    const p = T - 0.55 * (1 - RH / 100) * (T - 14);
    if (p > 31)
        return `非常悶熱`;
    else if (p > 27)
        return `悶熱`;
    else if (p > 20)
        return `舒適`;
    else if (p > 16)
        return `稍有寒意`;
    else if (p > 11)
        return `寒冷`;
    else
        return `非常寒冷`;
}

module.exports = parseComfort;