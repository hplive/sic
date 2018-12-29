class OrderDto  {
    constructor(orderId, address, items) {
        this.OrderId = orderId;
        this.address=address;
        this.Items = items;
    }
};

module.exports = OrderDto;
