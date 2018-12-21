class ItemDto {
    constructor(id, name, price, category, children, productId,material, finish, dimension){
        this.id = id;
        this.name=name;
        this.price=price;
        this.category= category;
        this.children = children;
        this.productId = productId;
        this.material = material;
        this.finish=finish;
        this.dimension =dimension;
    }
};

module.exports = ItemDto;

