const add = (a , b ) => a + b ;
const sub = (a , b) => a - b ;

// Module.Exports vs Exports

// const obj1 = {name: 'ahmed '}
// let obj2 = obj1
// obj2 = {
//     name:'dabah'
// }

// console.log(obj1)

module.exports = {
    add,
    sub
}