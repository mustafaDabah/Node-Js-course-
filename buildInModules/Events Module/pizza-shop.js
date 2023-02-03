const EventEmitter =  require('node:events');

class PizzaShop extends EventEmitter {
    constructor(order) {
        super();
        this.order = 0;
    }

    increment(size , topping) {
        this.order++;
        this.emit('order' , size , topping)
    }

    displayOrder() {
        console.log(`orders is ${this.order}`)
    }
}

module.exports = PizzaShop