```
type ItemTypes =  "foo" | "bar"; 

type FooItem = {
    type: "foo", 
    name: string; 
}; 


type BarItem = {
    type: "bar"; 
    age: number; 
}



function createRandomItem<T extends ItemTypes> (itemType: T) : T extends "foo"? FooItem : BarItem {


    if (itemType === "foo") {
        return {
            type: "foo" as const, 
            name: "hello"
        }; //Type '{ type: "foo"; name: string; }' is not assignable to type 'T extends "foo" ? FooItem : BarItem'.(2322)

    }
    else {
        return {
            type: "bar" as const, 
            age: 99
        }; //Type '{ type: "bar"; age: number; }' is not assignable to type 'T extends "foo" ? FooItem : BarItem'.(2322)

    }

}
```

https://www.typescriptlang.org/play?#code/C4TwDgpgBAksEFsAq4IGcoF4pQEQDMB7Q3KAHzwCMBDAJ1wG4oAoZ0SKAMWLkSygDezHDnYQAXHiIkANCxFQAdtQQSoaYLQCWigOZNmAXwOsxUAEJ1eCfkIVjJuGvQMLqutYoCuCShFoGhqxsqFAAIv5aAG4QACYokAA8SFAQAB7wirEY1gnoAHz8UCnpmdlSxLgA-Fw88DaSlrTWUAys+F6KAMbAWoSKUF20ENTwAErUWYQI1smpGRBZOfV5aIUAFForqJJIAJSS4ZEx8ajJhUKsClr4UJvbHJhPFSR7gsIKIsPAXrQDdp9AQ4XqRqBguv0NHIPoCFMpVI4ABYQAA2KJIMM+higYKO2hOeXOTAA9MS8lAAOQCKDAgiVJjwtQabR6JiGClQLQYRSEYA4tBoLS6ZSUFHQYCEGmhCklBZLEFQGrcQgtRpWeoUgB06wATABmHU6vZXERBBSotDQAGA76-f6Y2FSyCOZyg8GQ4DQx1uDySACcfodpv5eOicUJSHyJLJ0uptNdTHcnh8fgCUHZnO5vP5guF1FF4slZhl8zKGDpJEVtRV9SgauaGu1+sNxsxQSC7U6PT6A1ihAAytMIMBETpdAB1LaI5X3RCSZXWN6XDsdbq9fpQPuD1QjseTkdNWcIeuL95GVgQxQaKDSfhDEbjSZ9mb1dYV3B7AyX6-OO-DUYQBMUwvogb6up+LCsFuQ67no+7TsQ6zSBBzDQTuo5wVOM7OChQA


This causes an error. 

Why?


This seems like the best answer for this I"ve got: 
https://github.com/microsoft/TypeScript/issues/24929


Best we've got is: 

>In order for this to work you have to explicitly cast the return values to match the return type annotation because the type checker isn't capable of proving that it is always true:

https://github.com/microsoft/TypeScript/issues/22735#issuecomment-374817151

Not particularly helpful;. 



Best solution is to coerece the type: 

function createRandomItem<T extends ItemTypes> (itemType: T):  DerivedType<T> {


    if (itemType === "foo") {
        return {
            type: "foo" as const, 
            name: "hello"
        } as DerivedType<T>; //Type '{ type: "foo"; name: string; }' is not assignable to type 'T extends "foo" ? FooItem : BarItem'.(2322)

    }
    else {
        return {
            type: "bar" as const, 
            age: 99
        } as DerivedType<T>; //Type '{ type: "bar"; age: number; }' is not assignable to type 'T extends "foo" ? FooItem : BarItem'.(2322)

    }
}



