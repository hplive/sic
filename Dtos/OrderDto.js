class OrderDto  {
    constructor(orderId, customer, address, items, totalPrice, state) {
        this.OrderId = orderId;
        this.customer=customer;
        this.address=address;
        this.Items = items;
        this.totalPrice=totalPrice;
        this.state=state;
    }
};

module.exports = OrderDto;
