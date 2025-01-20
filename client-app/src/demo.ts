export interface Duck{
    name:string;
    numLegs:number;
    makeSound:(sound:string)=>void;
}

const duck1:Duck={
    name:'Huey',
    numLegs:2,
    makeSound:(sound:string)=>console.log(sound)
}

const duck2:Duck={
    name:'Dewey',
    numLegs:2,
    makeSound:(sound:string)=>console.log(sound)
}

const duck3:Duck={
    name:'Louie',
    numLegs:2,
    makeSound:(sound:string)=>console.log(sound)
}

duck1.makeSound('QUACK!');
duck2.makeSound('FUCK!');
duck3.makeSound('SHIT!');

//The export statement allows other TSX files to import whatever it is we're exporting, in this case an array called "ducks" with the 3 Duck objects inside of it
export const ducks=[duck1,duck2,duck3]