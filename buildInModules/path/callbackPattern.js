function greet(name) {
    console.log(`hello ${name}`)
}

function greetName(greetFN) {
    const name = 'mustafa';
    greetFN(name)
}

greetName(greet);
// I know this, but do you have another way. I don't want to use iframe ? 
