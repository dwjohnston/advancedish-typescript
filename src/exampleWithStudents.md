Let's say we have something like this: 

```
function generateRandomObject(objectType) {
    switch(objectType) {
        case "student": {
            return {
                id: Math.random(), 
                name: "Bob"
            }
        }
        case "teacher": {
            return {
                id: Math.random(), 
                name: "Cheryl", 
                qualifications: "Bachelor of Teaching"
            }
        }

        default: {
            throw new Error("Invalid objectType");
        }
    }
}

async function saveStudent(data) {
    fetch("/students", {
        method: "POST", 
        body: JSON.stringify(data)
    }); 
}

async function saveTeacher(data) {
    fetch("/teachers", {
        method: "POST", 
        body: JSON.stringify(data)
    }); 
}
```

https://www.typescriptlang.org/play?noImplicitAny=false&ssl=40&ssc=1&pln=1&pc=1#code/GYVwdgxgLglg9mABAcwKZlQJwIZVQJWzABM4BbAeQCMArVaACjlvqgBUBPAB1QEpEA3gChEoxAGcA7jCgQAFkxbROPfsLEbEEbONSIAROKghi6KPoBcgkZtuZUxzEnW3XomMSsBZXHIB0OCTkDLwANIg2brZg2GSoVvoAQsz6kVEAvmkamW7augZ42PJYltZRYvaOzlnliB7evgFEpGQh4TXlMXEJAMJyWBwANvrttZoAjiDYgzDAMNqwCOIJiUX9g3CYiHDAiGyoazBgyKljOa6ZHYimwNggg1BWLuVQcphwkogYnwCimO+YBj6ACSYAAbtMPNslOxuKh9LwANxXc6iTKXHQcSCIUCQRZIcTYMGoADKxlMYCgDGIuGwajSwAc8iBAHojCYzOIRmVXHFXnBPAYAAoUElsblXKgCjhWABSJIoADk-EZMEdkLMONTabw0ukkREMeIsRAceBoPACUTUPs1lhtVA6TzRIzZAp9CzCsVMFzws9NHy5AKEiKxRK3FLiDLEPKlSqoGrjpqHXS9QahJchFmgA

How would we start typing this? 

Well first, lets pause and identify that actually the "teacher" object is a super set of of the "student" object, - that is: all valid teachers are also valid students, because a student just requires an id and name, which the teacher has. 

```
type Student = {
    id: number; 
    name: string; 
}

type Teacher = {
    id: number; 
    name: string; 
    qualification: string; 
}



function doSomethingWithStudent(student: Student) {

}

function doSomethingWithTeacher(teacher: Teacher) {
    doSomethingWithStudent(teacher); //valid
}
```

So this is where I think it's good to always have a field to distingush between your types, like: 

```
type Student = {
    type: "student"; 
    id: number; 
    name: string; 
}

type Teacher = {
    type: "teacher"; 
    id: number; 
    name: string; 
    qualification: string; 
}



function doSomethingWithStudent(student: Student) {

}

function doSomethingWithTeacher(teacher: Teacher) {
    doSomethingWithStudent(teacher); //Error!
}
```




We might start with something like this: 

```
type ObjectTypes = "student" | "teacher"; 

type Student = {
    type: "student"; 
    id: number; 
    name: string; 
}

type Teacher = {
    type: "teacher"; 
    id: number;
    name: string; 
    qualifications: "Bsc" | "BA"; 
}

function generateRandomObject(objectType : ObjectTypes) : Student | Teacher {
    switch(objectType) {
        case "student": {
            return {
                type: "student", 
                id: Math.random(), 
                name: "Bob", 
            }
        }
        case "teacher": {
            return {
                type: "teacher",
                id: Math.random(), 
                name: "Cheryl", 
                qualifications: "Bsc"
            }
        }

        default: {
            throw new Error("Invalid objectType");
        }
    }
}


async function saveStudent(data : Student) {
    fetch("/students", {
        method: "POST", 
        body: JSON.stringify(data)
    }); 
}

async function saveTeacher(data : Teacher) {
    fetch("/teachers", {
        method: "POST", 
        body: JSON.stringify(data)
    }); 
}


const teacher = generateRandomObject("teacher"); 
const student = generateRandomObject("student"); 

saveTeacher(teacher); //Error!
saveStudent(student); //Error!

```

But whoops! This doesn't really do what we want. 

The problem is, that the `generateRandomObject` is typed to say it returns a `Student | Teacher` _regardless_ what item type you passed in. 

https://www.typescriptlang.org/play?#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCcCBuKAKH6hIUAMqkK1PFADe-KAqjCIALkLFyVGn3mKAlmTWUSAWzhcdiqJWYnVUYpz2UA5joC+g5VDQt2XaTkrZTUCJlYObkt9Q2tTc04eXQUbOzVHZzcBKwBHEmYAGz0AMz1kZmA9AHtKLFCAISxkWgYCeoBBXgFPfmKSSlRqyigXKi4KiAAlZkoyKpN4JFQACirEFHRMKDVFjYxILABKbbEJLXofP0jZZIcAdz1gdlX11H2IY6CrRXKsaCIztQCGovt9vpwIKROMNQWC4SF1ICaAAabJw9EGNQAWQqbAAdJwZnMTMtDqjbuirKl7G01gRyZTFJ50cy4b9-uF-NwQRS4RCoTDeYyEWErlx6ULKZioDjgPjCbN5qSGYzvtTQgBhSIgAr0tGqxR5QolMoVIZ1QiNZqSqyssE9dEUYrMEgFYA8g1yzhVO7WCC+gCinG9nGWBAAkpQAG7GshQNZLTaQAiHJIs26eHr8ZhYEADKB9AaVGoOZhRiDiTTUZZkCrME6VyTAT63YqQ54EAD0GibWD1sKsdjlVViBAACjBRGg9ZK4COQGoAFKiGAAOTxGVcJRANbrhwzqe6ghzeeQBf6gxLWDLEF8ES4u+A9bUd65LasbaebDDnc5kT7qIDooQ5sCOoQTlOM7onOZALlAy5rhuwBOFuxQ7rWT77rah78FmyA1MQShipw0ijJQ4xMNMioLK8wBhn+4o4fhtTAA4SKkWMhKUUS8y7CsAJVjQOH8Ne5avpEywMZwh6dp2QYhgAhCJN6Nloyw9loMlycGVScEpQA

To solve this, we can use a _conditional type_. 

```

function generateRandomObject<T extends ObjectTypes> (objectType : ObjectTypes) : T extends "student" ? Student : T extends "teacher" ? Teacher : never  {
    switch(objectType) {
        case "student": {
            return {
                type: "student", 
                id: Math.random(), 
                name: "Bob", 
            }
        }
        case "teacher": {
            return {
                type: "teacher",
                id: Math.random(), 
                name: "Cheryl", 
                qualifications: "Bsc"
            }
        }

        default: {
            throw new Error("Invalid objectType");
        }
    }
}

```

Now, unfortuantely we run in this error: 

```
Type '{ type: "student"; id: number; name: string; }' is not assignable to type 'T extends "student" ? Student : T extends "teacher" ? Teacher : never'.(2322)

```

This seems to be a limitation of TypeScript. 
https://github.com/microsoft/TypeScript/issues/22735

(Investigate further). 


To get around this, we need to cast those return types. So the way I would do this tidily, we will do this: 

```
type DerivedObjectData<T extends ObjectTypes> = (T extends "student"?  Student : T extends "teacher"?   Teacher : never); 

function generateRandomObject<T extends ObjectTypes> (objectType : T) :DerivedObjectData<T> {
    switch(objectType) {
        case "student": {
            return {
                type: "student", 
                id: Math.random(), 
                name: "Bob", 
            } as DerivedObjectData<T>;
        }
        case "teacher": {
            return {
                type: "teacher",
                id: Math.random(), 
                name: "Cheryl", 
                qualifications: "Bsc"
            } as DerivedObjectData<T>
        }

        default: {
            throw new Error("Invalid objectType");
        }
    }
}

```
https://www.typescriptlang.org/play?#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCcCBuKAKH6hIUAMqkK1PFADe-KAqjCIALkLFyVGn3mKAlmTWUSAWzhcdiqJWYnVUYpz2UA5joC+g5VDQt2XaTkrZTUCJlYObkt9Q2tTc04eXQUbOzVHZzcBKwBHEmYAGz0AMz1kZmA9AHtKLFCAISxkWgYCeoBBXgFPL0woABEuPQA3CDJ4JFR+iuYAHjQoCAAPJkoyHAmUdEwsAD5pAAoF5dX19QktAgB+BXFNKTVfCK4ASh1+YpJKVGrKKBcqFwKhAAErMNZVEybVDzRYrKhnaHbSB7KAHKqILYYESPF5QFSDJyjcaYqYzeb7IKKLAAdz0wHY6NJyIgeKpVgU5Sw0CIF2oBDU7I5Vk4EFInD+QuFwpC53uNAANNlpSqDGoALIVNgAOk44LIkIOLyVyRVHNS9jaGIIJrNincUGYOEJIzGSOmwDmaF2SRVnhVXJ54X83EFppVovFkvDdqUmFCwciNpjdrVUE1wB1eohJiNttjVgtoQAwpEQAUbcqCwo8oUSmUKr86oRGs0UxyHU6BkNie7yd72z0VRRiswSAVgGGC5nOFUadYIPOAKKcWecA4EACSlGGdbIUAxkxZBDeg9Nnh6-CdIG+UE+30qNQczFGd0kwAOZBm+LEfOAbNNYoxUZAgAHoNHfLBKylRQ7EzKpYgIAAFGBRDQSt2zgBCQDUAApUQYAAOW1DJXBKEBPxmF5zzebpBGvW97x+J8sBfCAnhDSjPR-DjIgAqwgIZNgN1AxMuCgpUYIUOC2AQ0IULQjCVSwsgcKgfCiJI4AnDI4oKK-T1qKsdxaP4S9kBqYglD8SJpABSggSYMEcyRDcxO4UyLNqYAHD-OzAT1Jz9UhVzeXlE93lY0ZeK4A53NMqKIDfLQ4ps14+FA0CoCXJZIFQMZstXKpOH4RLkuoA4IK0BK2Ji9cquoPFMuy3KtgKrg134IA

Ok, great that's working. 

```


So now lets extend this a bit with a `createAndSaveObject` function: 


```
function createAndSaveObject<T extends ObjectTypes>(objectType : T) {

    const newObject = generateRandomObject(objectType); 

    switch(objectType) {
        case "student" : {
            saveStudent(newObject); //Argument of type 'DerivedObjectData<T>' is not assignable to parameter of type 'Student'.
        }
        case "teacher" : {
            saveTeacher(newObject); //Argument of type 'DerivedObjectData<T>' is not assignable to parameter of type 'Teacher'.(2345)
        }
    }
}
```

Unfortunately, it looks like we have the same issue as we did before. 

https://www.typescriptlang.org/play?#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCcCBuKAKH6hIUAMqkK1PFADe-KAqjCIALkLFyVGn3mKAlmTWUSAWzhcdiqJWYnVUYpz2UA5joC+g5VDQt2XaTkrZTUCJlYObkt9Q2tTc04eXQUbOzVHZzcBKwBHEmYAGz0AMz1kZmA9AHtKLFCAISxkWgYCeoBBXgFPL0woABEuPQA3CDJ4JFR+iuYAHjQoCAAPJkoyHAmUdEwsAD5pAAoF5dX19QktAgB+BXFNKTVfCK4ASh1+YpJKVGrKKBcqFwKhAAErMNZVEybVDzRYrKhnaHbSB7KAHKqILYYESPF5QFSDJyjcaYqYzeb7IKKLAAdz0wHY6NJyIgeKpVgU5Sw0CIF2oBDU7I5Vk4EFInD+QuFwpC53uNAANNlpSqDGoALIVNgAOk44LIkIOLyVyRVHNS9jaGIIJrNincUGYOEJIzGSOmwDmaF2SRVnhVXJ54X83EFppVovFkvDdqUmFCwciNpjdrVUE1wB1eohJiNttjVgtoQAwpEQAUbcqCwo8oUSmUKr86oRGs0UxyHU6BkNie7yd72z0VRRiswSAVgGGC5nOFUadYIPOAKKcWecA4EACSlGGdbIUAxkxZBDeg9Nnh6-CdIG+UE+30qNQczFGd0kwAOZBm+LEfOAbNNYoxUZAgAHoNHfLBKylRQ7EzKpYgIAAFGBRDQSt2zgBCQDUAApUQYAAOW1DJXBKEBPxmF5zzebpBGvW97x+J8sBfCAnhDSjPR-DjIgAqwgIZNgN1AxMuCgpUYIUOC2AQ0IULQjCVSwsgcKgfCiJI4AnDI4oKK-T1qKsdxaP4S9kBqYglD8SJpABSggSYMEcyRDcxO4UyLNqYAHD-OzAT1Jz9UhVzeXlE93lY0ZeK4A53NMqKIDfLQ4ps14+FA0CoCXJZIFQMZstXKpOH4RLkuoA4IK0BK2Ji9cquoPFMuy3KtgKrg10ED4vmYv5kFFYF2jWUQ2KRWETgRDZmWxbBdiZI8Zp4gDTS8qyHJpJF-IcwLQWCqFmXmrFMFM01aXpRlDyOyB+OlQM5XfWgp1jMq-wOdakVozL2k4FxTC0A9ijjEQAHIXV7ZkPS9XZgagPQcEoKofKdLA9BcGw4AKaBgCqKAwGYPU4ICKpAe8YHyuAYHtTPAMnSDNLuB-KSOUSuq3sXD6MtA77frsKRiaB6BQZ7N0If7aHYfhxHHSwFG0eYDGsZxvGCbFImSb6YG6spg4ACYAGYABYAFYjOlf17TMrquqAA

We can solve this with casting: 

```
function createAndSaveObject<T extends ObjectTypes>(objectType : T) {

    const newObject = generateRandomObject(objectType); 

    switch(objectType) {
        case "student" : {
            saveStudent(newObject); //Argument of type 'DerivedObjectData<T>' is not assignable to parameter of type 'Student'.
        }
        case "teacher" : {
            saveTeacher(newObject); //Argument of type 'DerivedObjectData<T>' is not assignable to parameter of type 'Teacher'.(2345)
        }
    }
}
```

But this aside, I hope you can see an anti-pattern arriving here. For example, what if I want to add a third object type `administrator`? 

I would then have to go through each of my `createRandomObject` `createAndSaveObject` and update the switch statements. This would become quite cumbersome, imagine if I had twenty or so such functions!

https://www.typescriptlang.org/play?ssl=1&ssc=1&pln=107&pc=1#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCdaGDmyAtgEtKQ4p2bAA9twDcUAFALQkKAGVSFanigBvBVENQVEAFyFi5KjXkGjQsucokBcLraNRKzAWajiRAHNbAF8lEyg0FnYuHX1PE3MCJlYOOUVPBycXN05ZO0NvX3MAymCMowBHEmYAGyEAMyFkSSEpSiwkgCEsZB5CLoBBAlDwzChBwRExYAlpTjiC40wk-mFRcUkZEcUwsdUAES4hADcIMngkVAPJZgAeNCgIAA8mSjIcS5R0TCwAPh0AApHi83h8LJprAQAPyGDRWbTmEGvKjg5LRNK0WFRVKxcyTdYzOYyACUtgUDRIlFQbUoUECVC4kggACVmO8pAIvqgHk8Ue9PohvhhIP8oICpELUCLoEiSVBTEdOKdztzgDdgPc0AD4kYsAB3ITAdgSqU-SDy3WeQwtLDQIiQ6gEcxW62eTgQUicOmut1uxIQhE0AA0FT9fqyUAAspI2AA6CQcgSAkmhpbhzxFPwELqSghpjNGEJQZg4JUqi5mjVav75cNhcO2+0pGLcF3pv0er0+juFgPo3HcYO9jORmPAeOJsiclMFwvWrNJADCaRAtXzYfnhmqdUazVa7U6A16BBHnmLpag5bOlau6tuDz+I72jdL9rW00282dejPRi7JDer+W4JCshAfhssxbNwf6GBeZbHDearVo+Hh+i+foUA0zAkLUwDtluE6cFI+peBApEAKKcMRnCAgQACSlAnLuZBQJKd4ygQZLPksYR7AopYgNSUCUtSwC0v4zBnPCWjAICZC3Aq6iOsAlpLA0nomgQAD0liyVgG6+kYvgTlIjiEAACjAahoBuI5wGZIDmAAUmoMAAHJxqUgSNCA8m3CSvFkrsSiCcJok0u0klnDirb+ZqSmxWkameBpxpsHR2ktmkBmhkZhgmWwZlJFZNl2eGDlkE5UCuR5XmzEEvnxcwgXnsFCh7GFyAiVSkV0lgUkQASn5QfMzX4lMkHEpwKVGGlWnaRBRLQblwF+oVxWWdZtlzm6lXVbVnneU1Cmaq1RbtR1SgKMgh7AMYGKxPgDKUEyTBskmap0dlXBcbYt0dPdenWDoL1vay7LTlyZp0cDTqXQNMWPbRP0zbYiMQDJ1iAqjwXadpUAUc8kCoOchPUTICgY1j1CAnDqno4NSVcHTKnyvjhPE98ZNcDR10ReJUXIB6zKDO8aiDWqvKgqigocb8fymvLqhyr+SwA8QZH6mqoOMnMEOfTD7HCpgl2eAaRomsb0qm2tbpNoGsm0AR87UypgKvdrZoljgNMM5u54jg7A6ts7dsZhjzO0Z7OuXlH7X1kHb7gZNy3fi7hYY8NU3QR75Gxzg2dp6SaFug2RZXddShAA



Instead, what we would like to see, is something like this: 


```

const typeToFunctionsMap = {
    "student": {
        create: () => {
            return  {
                type: "student", 
                id: Math.random(), 
                name: "Bob", 
            }; 
        }, 
        save: (data) => {
            fetch("/students", {
                method: "POST", 
                body: JSON.stringify(data)
            }); 
        }
    }, 
    "student": {
        create: () => {
            return  {
                type: "teacher",
                id: Math.random(), 
                name: "Cheryl", 
                qualifications: "Bsc"
            }; 
        }, 
        save: (data) => {
            fetch("/teachers", {
                method: "POST", 
                body: JSON.stringify(data)
            }); 
        }
    }, 
    "administrator": {
        create: () => {
            return  {
                type: "administrator"
            }; 
        }, 
        save: (data) => {
            fetch("/administrators", {
                method: "POST", 
                body: JSON.stringify(data)
            }); 
        }
    }, 
}
```

This is what we call a _declarative_ style programming, and it's nice and... declarative. 


That way, we can refactor our `createRandomObject` and `createAndSaveObject` functions to just: 

```
function generateRandomObject<T extends ObjectTypes> (objectType : T) :DerivedObjectData<T> {
    const createFn = typeToFunctionsMap[objectType]; 
    return createFn(); 
}

function createAndSaveObject<T extends ObjectTypes>(objectType : T) {

    const newObject = generateRandomObject(objectType); 
    const saveFn = typeToFunctionsMap[objectType]
    saveFn(newObject); 
}
```

https://www.typescriptlang.org/play?ssl=83&ssc=1&pln=71&pc=1#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCdaGDmyAtgEtKQ4p2bAA9twDcUAFALQkKAGVSFanigBvBVENQVEAFyFi5KjXkGjQsucokBcLraNRKzAWajiRAHNbAF8lEyg0FnYuHX1PE3MCJlYOOUVPBycXN05ZO0NvX3MAymCMowBHEmYAGyEAMyFkSSEpSiwkgCEsZB5CLoBBAlDwzChBwRExYAlpTjiC40wk-mFRcUkZEcUwpWR24mXINCkAMRJKVDaOgFlmMEXPIk1rAnN4zyNkThYmcwAFABKPAAPj0Sy+Rl+pE4lEMnyhSOOfheVmoBAANBVkVCslB7sA2AA6CSUMhSATA7GQ3GFHyorpSOBYnG4kIeJEhGnIrDMABufgBZEkzBBuHBiNxDQgwHYAIIAHpLFpgFhWVK6YZfESpI5CAAFGBqNCs2l0uB6kDmABSahgADliaVAo0QMLRUDzV8QkDOVCwp5uWy0ar3hDkT8-kLxZLvZ4YSQ4Qj40jEoxomksam8frCSSyRSqUCeVrPEVUQBhNIgWpmsueap1RrNVqHbq9Ag5qActlB0tQvmCwEi4BisERrUyuVsBWKlIxTjq7GarU6th6pJGk31huGS1ka1QO2O52zIJuj1jr1l33+n1LYNLPhTDazLbcD7eqOSGMT1dQomyaTnu6YvusMxzNs3a9t6T68gKQqjuOEogdKsrykqazTJs8zLmhZbrpuhrGqaA4NgeR4nk6LqXshN5anefZGIGLE0nsyjjAAIlwQiCmQ8BIKgXGigAPGgUAQAAHkw5I4IJKDoJgWDgvgAISdJslkDgoZvAA-IYGjosAUDmBpMlUNpGapFwtAGVENkLOYkwQbhMh+ooCgNJc1ztFAgRUFwv4AErMOSlIKag4mSRZcmwIgikYJAKlQACzJCUpqhmSCpg8ZwfEQAJCXCWJaBxp4BwdCZP5MGc8L4CYpwXFcwA3Fg9xgAA2uliWYAAuveQHwjVEB1cCoxeT5rV+SNgzkmoiGRcA0WaZZ8nFZl2CgmlG1JdA2UQkslVHJQEAAO5LToAWnXMECheFAhLTtGV7R5R2HCZQ6jfVKJNVNbUdd1u39UsX1jadF0bW9HFKLDzBYCAVxQN5LU3P4iFGaqV7MKZ6ivNQIJStOmHKvjaoat6RH6gQ25kcx+5Wra9o0eeZR0Z6j7Q0o8OI8gyP-X5X0OYu2O48LaSE0sxOzkqC5pPhAFQFTW6kbuUKUUzp60Q07r0ZzE080jKO+fCX0uTh77zNjzmvpBH6S540tzthb5QUuFPIsrJE7uRnga8ezNnvlbM69jDGGExSgccdJly7E+DXUFTD3UWT3JJmtlvTH-hk1dgW3SnEUbQqKpvG9ChCxnnAAnHnBvV9mPWDXVceYqipQAAolJkCoIVnecJwMgVxjZMAqXBO2JXjlj2TIJt533eKX3XCD5wsNAA

So how would we type such an object? 




Maybe something like this? 

```
type TypeToFunctionMap = Record<ObjectTypes, {
    create: () => DerivedObjectData<ObjectTypes>; 
    save: (data: DerivedObjectData<ObjectTypes>) => void; 
}>
```

At first it looks ok: 

```
  Object literal may only specify known properties, and '"should-error"' does not exist in type 'Record<ObjectTypes, { create: () => Student | Teacher | Administrator; save: (data: Student | Teacher | Administrator) => void; }>'.(2322)
```

But actually, this isn't giving us errors when it should: 

```
    "student": {
        create: () => {
            return  {
                type: "administrator" //should error!
            }
        }, 


The problem is similar to that mistake we made earlier - where we are saying that any `Student | Teacher | Adminstrator` is ok. 

https://www.typescriptlang.org/play?ssl=31&ssc=12&pln=26&pc=1#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCdaGDmyAtgEtKQ4p2bAA9twDcUAFALQkKAGVSFanigBvBVENQVEAFyFi5KjXkGjQsucokBcLraNRKzAWajiRAHNbAF8lEyg0FnYuHX1PE3MCJlYOOUVPBycXN05ZO0NvX3MAymCMowBHEmYAGyEAMyFkSSEpSiwkgCEsZB5CLoBBAlDwzChBwRExYAlpTjiC40wk-mFRcUkZEcUw5XGMSDQpADESSlQ2ygBZZjAdACUUGTIAHngkVEPsABo9JeQnBYTHMAAoAJR4AB8UAAIlwhAA3CBkD4oYCwyTMd6IdHfLBQjxGLDMZFgshY8zwzhIlFo1CY4DY+noTAEyG4GGIqQOUJQpTIdrEZZHU7nS5C273czfY5nC7AK5SxaeIiaawEczxTxGQHAvwQ6H-HUmqBA0icSiGbWm02JQhraabeYEJa2sLuv5u4mkg0UpkcmE221QBoQYDsUEEAD0li0wCwBD+wZDRl8wDYUkchAACjA1GgkxVU544FmQOYAFJqGAAOQAdKVAo0QKD-cxwd6TSFwUTu0sQl7VSkYtwtV2oHrJAbA8aS+aSJbrRPbfbktE0kmV6aslBbhn6xJKGQpAIIUOS54in4CABhNIgWpF7cm6p1RrNVpC7q9V2XkJ9jqg7FjqJJklAbZYrOKammGEZsFG0YjmkibJi+Orppm2YEHmBbPpepbllWNYNk2LaQQG6E9oBngekYwFLHwUwbLMWxjnOJpTiCEHQehC5LhxBFro6LFzNsVE0fRF4mmBfpQUaMEmnBkYxiJMxiZwqGCZemFZkkuGFtJBFlmQFZQNWdaNrMQTke2nb-r2IG0QOXqMVgmYkLUZAALRcJw2xalA0bRkYLJQPUTASLUUACMwIBQO0tTxVgkDIC2UAANaUFIADuVpgP5kCcIqvxQMwx5QAA5EQHleb5nD+dwlVQCe2BeFIwBQBAAAeMxQCIIrQJVTyCpwbwsviyaTkC05grOGhWNoDBRKksQMJM6zqWx8iyeSlLqOqS2RBua0TMxW3zLO3K8lAIRQpV9aggATAAzE9T2dkozl7BE1K0qiuIMlirxoF13VMMeOATWyML4KCoM9RDZA4Gqi00AA-IYC3xlAMpg0jKPIVwtCYyto645E+NUMjDrnc62xQJjG1Oqx8wU5QEDIpwjlKLzwWDYNcrioqkp3Is-OeAA2gA0v1VrQ5AWAALoU-oEumlxM5Gn9yIA58GLA9LhKKOrMm+ntTJUgiussoy2JG1dPJkLYpu3Qo-N7LzDTC1cUCBFQXDTg85UngILIg1TkOwIDrKKzCoJSDH3wU2gkKmDrdIx3bINBgCQqdZrJxWvgJhCwqVxYFKkuJ-r3xK-Wmv5J4wWCh0BczUwRdzUa2PWPQx2rQs6106zMhLPxVqF5QELyBLyeVb31DNWI7WdcwWBYEIgTeHAtTQNIAuVRnevotnaD3Y9r3vZ9eze+X7TTfqgzHmovrhwj4PU1DScwwnP+qDKSE+g85ty8BAHKYV8D+w5nMCAwdjynhZH-WumAeaeFbsKWSRcdClzFPfDoVca54kwPXWSgEsHTw5hAmOPNPa8yUOvEAFxQw+wfrJRewAKLMAphwoBSxlIIRjHGawWlFIxXDFhfS+ZDJOSMCZMyFlSLWTKLZKCA5aEMKwEw5ALD8H+F9GTNIXCU4nW5oJARiEiaaSLGI3S2EDL4VNPI4ilkyINFbHZdRowFCMOYXfCUVpZLM1EmxLh5hgkXRkHwzwFjVIjw0qIicdipF4SMoRUyLilE0hUe4rh9l6I8wUJ7DBnUrE6GgYHJg8DQ5IPXIPAgPMSn+EOp1KBAdYHVMQTHKMwjqANNsAoWShiuCgisTzdhLTRmmMcvzAAot1VKTAyBQFmQ1MeEy0agl6cAcZBjTFbJaZCOZCz0Qoi6mszgvMgA


What we want is a _mapped object type_. 


```
type TypeToFunctionsMap = {
    [K in ObjectTypes] : {
        create: () => DerivedObjectData<K>; 
        save: (data: DerivedObjectData<K>) => void; 
    }
}
```















https://www.typescriptlang.org/play?#code/C4TwDgpgBA8gRgKwgY2AFXBAzlAvFAIi2AFcATCAO2AKgB9DgIBDZACwgCdaGDmyAtgEtKQ4p2bAA9twDcUAFALQkKAGVSFanigBvBVENQVEAFyFi5KjXkGjQsucokBcLraNRKzAWajiRAHNbAF8lEyg0FnYuHX1PE3MCJlYOOUVPBycXN05ZO0NvX3MAymCMowBHEmYAGyEAMyFkSSEpSiwkgCEsZB5CLoBBAlDwzChBwRExYAlpTjiC40wk-mFRcUkZEcUwsdUAYU4WJgAxSgAeNCgIAA8mSjIceCRUDEgsAD5DfAAKAEo8N8ACJcIQANwgZBeKGAwMkzCun1sETUzEh5yuN3uVCesEQsPe2G+fzICPMoM4EKhMNQ8OAiLQn0BuG+4KkDlsynGRLQUlOJEoqDaHQAsswwItPABtADSUBE+Ne6EwWAAulBzPFPEZkMdJH4jicIJjZciKjr-Oi-GiMZczR4jGE9sh2sRlpA+QKhcARVhxZLzLz+YLhW6A1KjERNNYCFqlp49cbzACgXoE5aoMdSJxKIZtZnM4kLDHqAQADQWws6rJQcXANgAOgkjykAgBlYz1a8Pj8BC6UjgFarhZCjstIU7haw1pTZIZLO+BerDQgwHYvwIAHpLFpgFhh8vu4ZfA2pI5CAAFGBqNDDrvVuDnkDmABSahgADlG6VAo0QL887MP8D6eCE-zjjqYRgVOUYpDE3DxoWSYGimi7pseWZriQub5qBRYrIw0RpBW+GWrW9ZNi2ZBth2I7HkUfYHGkIC1PemGeNUdSNM0rRut0vQEGRUBjvRhiTmJVqQnOCLoUemaruubCblu8FpAelbyd2p5sOeSTXre7EcYYT5kC+UDvl+P6zEE-6AbJwngZBYFLBJSx8FMGyzFsiEYZmKFMGhaZaTq2Y4XmfnGcWHnrDMczbI5zlOrBloztJUD2QuwXCYpG7bms0ybPMGmRRxOl6VeN53ilHGmeZlnfr+dlASBmFOZJ0HJYo7lYLpJC1GQAC0XCcNsWpQFuW5GLSwBQPUTASLUUACMwIBQO0tRrVgkDIP+UAANaUFIADueZgKNkCcL62CVswjxQAA5EQfUDcNnCjdwD1QDR2BeFIs13DMCp5hED0AEooDIZAXDNRJYJpUABX4qasuopazQwUSpLEDCTLFRUyPIaXI0B5gaFY2iY8ROMTJ5cU+eh7KciJnwPY2vwAEwAMwcxzIFKC5ewRJS1LQgSdIIlidwPHisOqiSGXXNLuI4NGFM0AA-IY5N7pqkTYjLqtqVwtBa1jCF60rOKPKrBVefF3BQFreOFd58x65QECQpwEHdUoCiTR60AmF6oa+uGEqLIHMryoqcsfBq8bR-5+qBRl6Ei5CYvKvSiIOooyepbOGWk1Amc0uLcKS2ajMcmQtiFyJAdTXs-sNGHIpQIEVBcAaYN3TRAgzVL1uy5XcPfL8g7KkSluAqY5fZ7CudIqVrodLNSPnDoIchj6foBtK0+EpgaqNkjUDMDgRoGpiTL5J4k3r+6W+UEFqM69Y9CRNTCy43TBNOBLDCrhV+AJ5DR1ng9T+1AvpiD+rNK+WAhCBG8HAWowcpBB0eovGaK8mRs05jzPmSg9jt33u0RGqcICDEeLaCAw8raGyVCfD4nwp7j3GEGQE+gljP1mp7Y6M0dDd09nMCA-dWxD0rhwmemBfZ8LdLNYm298C729GGMUEoj6cMgGfYml8cD0LvuaJYKjKC-EETNBRrd-ZKCviAIUUByGaKkhAGBwBMrMD1h4nhSxcrKW3LuawJUQrlQvAQAy1VJJ1TfB+RqNkyjNQcmBGx9isCOOQM4julDibmzSF4y2v8-GeACSpY2nBQkPnCfpKqRlLSxIsvE6yVIkkNAAi1VyaSFAOKcS48OeZiYu3tj5Lx5hhn03mCUowZT8oALdjIKphYamVUMjVTwjSGotNsu0rxrUnQKIUK3fhxhf4iJ7uIyRg8ZqbgqQQBRJzgnaHwKI3uTArlthuWrPc9yuR5N-r8CpCjiYeMBcUiBU0ACitwdpMDIFASF70ZAKBBejX4TzgDAutPkrg6L0aAkDtC2FUIbhIqAUoIAA