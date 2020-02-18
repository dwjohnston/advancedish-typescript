//https://stackoverflow.com/questions/58966420/infer-types-from-key-value-pairs-where-the-values-are-function-signatures

export type FunctionMap = Record<string, () => Promise<any>> 

const myFunctions = {
    a: async () => "hello",
    b: async () => 123,
    c: async () => ({ foo: "bar" })
}; 

async function callFunctionsAndReturnMap<T extends FunctionMap>(map: T): Promise<{
    [key in keyof T] : ReturnType<T[key]>
}> {
    //I would use Object.entries, but TS Playground doesn't like it. 
    const keys = Object.keys(map); 
    const awaitedValues = await  Promise.all(keys.map(v => map[v]).map(v => v())); 

    return keys.reduce((acc, cur, i) => {
        return {
            ...acc, 
            [cur]: awaitedValues[i], 
        }
    }, {} as  {
    [key in keyof T] : ReturnType<T[key]>
});    
}

async function start() {
    const result = await (callFunctionsAndReturnMap(myFunctions)); 
    console.log(result); 

    result.a; 
    result.d; //Expected error 
}

start(); 