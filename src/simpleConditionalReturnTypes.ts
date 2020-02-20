//https://stackoverflow.com/questions/48808014/typescript-conditional-return-value-type

function timesTen(n: number, returnString: true): string; 
function timesTen(n: number, returnString: false): number; 
function timesTen(n: number, returnString : boolean): string | number{
    const n10 = n * 10; 

    if (returnString) {
        return n10 + "";  
    }
    else {
        return n10; 
    }
}

const x = timesTen(10, true); //Type string
const y = timesTen(10, false);  //Type number




export type Foo = {
    a: string; 
}

type Bar = {
    b: string; 
}

function useFooOrBar(item: Foo): string; 
function useFooOrBar(item: Bar): number; 
function useFooOrBar(item:  Foo | Bar): string | number {
    if ("a" in item) {
        return "string"; 
    }
    else {
        return 111; 
    }
}

const a = useFooOrBar({
    a: "a"
}); //Type string

const b = useFooOrBar({
    b: "b"
}); //Type number