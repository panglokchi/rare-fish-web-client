const sortFish = (a, b) => {
    if (a.isNewFish && !b.isNewFish) {
        return -1;
    }
    if (!a.isNewFish && b.isNewFish) {
        return 1;
    }

    const rarityValues = {
        'common': 1,
        'rare': 2,
        'epic': 3,
        'legendary': 4
    };
    const rarityDiff = rarityValues[b.rarity] - rarityValues[a.rarity];
        if (rarityDiff !== 0) {
            return rarityDiff; // Sort by rarity
        }
    // If rarity is the same, sort by level
    return b.level - a.level; // Sort by level
}

module.exports = {
    sortFish
}