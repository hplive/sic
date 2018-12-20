class ItemRestrictionDto  {
    constructor(width, height, depth, material, productId) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.material = material;
        this.productId = productId;
    }
};

module.exports = ItemRestrictionDto;
