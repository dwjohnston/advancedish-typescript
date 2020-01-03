//https://stackoverflow.com/questions/59572807/convert-an-array-of-one-type-into-a-mapped-object-of-that-type/59573070#59573070

type Foo = {
    name: string;
    value: any;
}

const myFoos = [
    {
        name: "hello",
        value: 1,
    },
    {
        name: "world",
        value: "bar"
    }
] as const;


function createObjectFromFooArray<T extends Foo>(foos: readonly T[]) {  
    return foos.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: cur
      }
    }, {} as { [K in T["name"]]: Extract<T, { name: K }>});
  }

const objectFoo = createObjectFromFooArray(myFoos); 

console.log(objectFoo.hello); 
console.log(objectFoo.asdfed); //Expected error



