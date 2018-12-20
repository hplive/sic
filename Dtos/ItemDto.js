class ItemDto {
    constructor(id, children, productId, material, finish, width, height, depth){
        this.id = id;
        this.children = children;
        this.productId = productId;
        this.material = material;
        this.finish = finish;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
};

module.exports = ItemDto;

