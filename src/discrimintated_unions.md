
Best reading here: 
https://basarat.gitbook.io/typescript/type-system/discriminated-unions 

This example is good too: 

https://www.typescriptlang.org/play?declaration=false#code/FAj0oAgOQQwSwG4FMJIB4wLYAcA2SAuCEYAFwE9sUAFAewGd64AjfAFUqXogF4IAiAGa1a-CAB8BzGACd+AbmJlOEAJKkkmADxtUaDQDsAJtzqMW7Ttz5mmrJByr0AfLwgBvYBG8QKVImyKXj5GMKQwAXqGJgLCogD8EPSkMnAGAOYQRAYArpjMSDJBAL5BIH4oAKIYOPgAjG7qmkHgFRDVWHhIDXye4D6+nES2Fg5W8sD9IWERSSlpmZK5+YUT4MUkbQAicPQAxqmYaWFIRgCqBnC0Bk3auujRpgx2lk5uI-aOXK6eAwDaAGkIGkIB9XlwALpZDzBAbeCpEAFBOHTcKIqJIYzcIQiMSJZKpDLZPIFIrEAYbYp-NgQsptDq1JAAJjcO32h2OGnOl2utxakHpNS6LN6k0gAwRsVxa3FqNmBIWMogxQkMKmPkl-GkciVA1CaIgy1JSo2YogACE4JkjHBBIJCpi9kgAIRAA


Example for this documentation here: 

Say you have something like this: 


```
type ItemIds = "foo" | "bar"; 

type FooData = {
    name: string; 
}

type BarData = {
    favouriteColor: "red" |"blue"; 
}

```

And you want to do some matching between the ItemIds and the Data, then how would you achieve this? 


You could manually define them: 

```
type Foo = {
    type: "foo", 
    data: FooData; 
}

type Bar = {
    type: "bar"; 
    data: BarData; 
}

type PossibleItems = Foo | Bar; 

```

Then Typescript is smart enough to _discriminate_ between these types, and figure what the other types are. 

This is called a _discriminated union_. 

```
function someFn(item: PossibleItems) {

    if (item.type ==="foo") {
        item.name.split(''); //Typescript knows that name exists and it is a string
    }else {
        //Typescript knows that it is dealing with a Bar. 
    }
}
```

**A better solution to manually defining them?** 

Instead of manually defining those types to match the key to the data, we could use conditional types: 

```
type DerivedType<T extends ItemIds> = T extends "foo" ? FooData 
: T extends "bar" ? BarData
: never; 
```

However, this is where we can run into trouble: 

```
type PossibleItems2<T extends ItemIds> = {
    type: T; 
    data: DerivedType<T>; 
}

type PrintPossibleItems2 = PossibleItems2<ItemIds>; 
// type PrintPossibleItems2 = {
//     item: ItemIds;
//     data: FooData | BarData;
// }
```

This doesn't work as we would like. For example this is valid: 

```
// This shouldn't be valid.
const test1 : PrintPossibleItems2 = {
    type: "foo" as const, 
    data: {
        favouriteColor: "red"
    }
}; 
```

What's happening is that TypeScript is treating the type union T independently for each use in our PossibleItems2 type. 

```
type PossibleItems2<T extends ItemIds> = { // T = "foo" | "bar"; 
    type: T; // "foo" | "bar"; 
    data: DerivedType<T>; //FooData | BarData; 
}
```


**Utility for creating discriminated union**

So instead, we can use this tricky bit of typescript to properly create the discriminated union: 


```
type PossibleItems3<T extends ItemIds> = {
    [K in ItemIds] : {
        type: K; 
        data: DerivedType<K>;  
    }
}[T]; 
```

Output:

```
type PrintPossibleItems3 = PossibleItems3<ItemIds>; 
// type PrintPossibleItems3 = {
//     type: "foo";
//     data: FooData;
// } | {
//     type: "bar";
//     data: BarData;
// }

const test2 : PrintPossibleItems3 = {
    type: "foo" as const, 
    data: {
        favouriteColor: "red" // Expected error!
    }
}; 
```


So what's happening here? 

First, let's strip out the generic and the `[T]` of the PossibleTypes3 thing, and just do this: 


```
type MappedItems = {
    [K in ItemIds] : {
        type: K; 
        data: DervivedType<K>
    }; 
}

```

Output: 

```
type PrintMappedItems = MappedItems; 
// type PrintMappedItems = {
//     foo: {
//         type: "foo";
//         data: FooData;
//     };
//     bar: {
//         type: "bar";
//         data: BarData;
//     };
// }
```

Now this starts to make more sense. 

This structure is called a _mapped object type_. 

Here, each possible element of the union type ItemIds is referred to once at a time: 

```
type MappedItems = {
    [K in ItemIds] : { // K is only one of "foo" or "bar" at a time, it is _not_ "foo" | "bar"
        type: K;  // "foo"; 
        data: DervivedType<K> // DerivedType<"foo">
    }; 
}
```

The rest of it now makes more sense. 

The brackets syntax `[T]` is called an [_index type_](https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types). 

Essentially what we're doing is saying is 'What are the values that are accessible by these key(s)'. 

```
type PossibleItems3<T extends ItemIds> = {
    [K in ItemIds] : {
        type: K; 
        data: DerivedType<K>;  
    }
}[T]; // T = "foo" | "bar" so what is returned by this is the corresponding values of the mapped object type. 
```

