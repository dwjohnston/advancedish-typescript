import React from "react"; 


export class Foo extends React.Component {
    

    render() {
        return <div>hello</div>;
    }
}

export class Bar extends React.Component {



    render() {

        return <Foo/>
    }
}

export const Chaz = ()=> {
    return <div>hello</div>
}

const a = new Foo().render(); 
const b = Chaz();

console.log(a); 
console.log(b);
console.log(JSON.stringify(a) === JSON.stringify(b));