//https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
//https://stackoverflow.com/questions/58515515/discriminated-union-check-on-existence-of-a-field

export type privledges = "access_library" | "access_staffroom" | "access_safe" | "access_sportsroom"; 

type Teacher = {
    name: string; 
    privledges: privledges[]; 
    pay: number; 
    role: string; 
}

type Student = {
    name: string; 
    privledges: privledges[];     
}

type Person = Teacher | Student; 


function promotePerson1(person: Person) {
    //TypeScript can infer that the person is a Teacher
    if ("pay" in person) { 
        console.log(person.pay, person.role); 
    }
}

//The other way to do this is to use a `is` predicate: 
//https://stackoverflow.com/questions/60272040/when-would-an-is-predicate-ever-be-needed-as-opposed-to-using-the-in-operat
function isTeacher(person: Person) : person is Teacher {
    return (person as Teacher).pay !== undefined; 
}

function promotePerson2(person: Person) {
    if (isTeacher(person)) {
        console.log(person.pay, person.role); 
    }
}



