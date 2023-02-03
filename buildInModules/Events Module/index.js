const EventEmitter = require('node:events');
const DrinkMachine = require('./drink-machine');
const PizzaShop =  require('./pizza-shop');

const pizza = new PizzaShop();
const drink = new DrinkMachine();
const event = new EventEmitter();

// console.log(EventEmitter)

// pizza.on('order' , (size , topping) => {
//         console.log(`order received baking ${size} pizza with ${topping}`);
//         drink.serveDrink('large')
// });

// pizza.increment('large' , 'mushrooms');
// pizza.displayOrder();

 
// const emitter = new EventEmitter();

// emitter.on('order-pizza' , (size , topping) => {
//     console.log(`order received baking ${size} pizza with ${topping}`)
// })

// emitter.on('order-pizza' , (size) => {
//     if(size === 'large') console.log('large')
// })

// console.log('first')

// emitter.emit('order-pizza' , 'large' , 'mushrooms');

const eventEmitter = new EventEmitter();




eventEmitter.on("myEvent", (event) => {
        console.log("Listener " + event) ;
});
eventEmitter.on("myEvent", (event) => {
        console.log("text " + event) ;
});
eventEmitter.emit('myEvent');
eventEmitter.emit('myEvent' , 2);