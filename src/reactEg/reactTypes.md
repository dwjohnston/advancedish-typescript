

## React.ComponentClass vs React.FunctionComponent vs React.ComponentType

`React.ComponentType` is the easiest to understand, it's just `React.ComponentClass | React.FunctionComponent`. 

These types are essentially *functions* that create the component *instances* themselves. 

But there is an important distinction: 

A Functional component accepts props only and directly returns JSX. 

A Class component is first instantiated, and then returns JSX via it's render method.


ie. 


```
class Foo extends React.Component {

    render() {
        return <div> hello </div>; 
    }
}

const Bar = ()=> {
    return <div> hello </div>; 
}

//These two produce the same result
const a = new Foo().render(); 
const b = Bar();

console.log(JSON.stringify(a) === JSON.stringify(b)); // true

```

`React.ComponentClass` has more generic parameters than `React.FunctionComponent`. 

## ReactComponent 

Is a special case. 

This is the instantiation of the class component, but not the rendered JSX. 

ie. 

```
   const instance = new Foo(); //Instantiating the component, without calling the render method. 
```

I can't think of a scenario where this might be useful, except maybe in testing, because if you are writing JSX, you are always both instantiating the component and calling the render method. 

https://codesandbox.io/s/elastic-bhabha-oss83?file=/src/App.js


## ReactElement vs ReactNode vs JSX.Element

These types are the *instances* that are created by the above types. 

More details here

https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement

To understand the difference between these, see this code: 



A `ReactElement` is specifically a 'reacty' element, it basically looks like this: 

```
{ '$$typeof': Symbol(react.element),
  type: 'div',
  key: null,
  ref: null,
  props: { children: 'hello' },
  _owner: null,
  _store: {} }
```

A `ReactNode` is this, and also other valid JSX expressions - such as a ReactFragment, a string, a number or an array of ReactNodes, or null, or undefined, or a boolean.

A `JSX.Element` 



### Usage

It does look like you should just let TypeScript infer the the types. Particularly with `React.FunctionalComponent` it has some quirks. 

See this answer: 

https://stackoverflow.com/a/59840095/1068446





More notes: 

https://www.typescriptlang.org/play/?jsx=1&ssl=18&ssc=68&pln=18&pc=36#code/JYWwDg9gTgLgBAJQKYEMDGMA0cDejUYByEAJktsujAKIA2SISAdvAL5wBmUEIcARFAIw+AbjgAoSQHoAVDPFwZcagA8wtYGmAxaATzgBnGChhI4KA-irEycALQB5ANIKZU8WghMjcAGIQIOABeOAAKAEoALisiUjMggD44AB4SYAA3OCkEsQ8vH38IACZgsKiYmBt4pKYAV1paXM9veEKAZlKI6MpY20T+AAskBohRCXEpKTgACQgAdyR0pChsJgh4CABrOCHBPJbOFFLkwqyc-Z8OACNjwqLsuBEL+A40W4C2h6fpOVdlNQ0Wh0+iMJjMFgqdAYzBgrnczR8ACEUFBOuUejR6IwWMEkqkMmcngj4MioCUQl1IViYbi4HUGkT8iSUR0KeihFDsfB+nwhiMxpM4MQNtsUExdHMUPo7HA0GKAOTwQQwWpQJiGGBQYBMADmBkkxLgVyOIWSpMJzyNN1NpPuSUZByubxtLK+P3kin+6k02j0GrB5ksGM5NIAPnT6rR7HA4M44ZbEdqdWjuhzqTj+vjMtkHUik+SyqmqCGceH6bR+uXcySk6zC1ToaWIw1abzhrRRmJBcK4FtzOLJboDUyjUmTSlE7qLYarknrRP826Z0nnQvdR0c5IJr9PapvUC-aDTIGG1z44bEV5k2zogApADKAA0AHQl7l4tLZ84Xq8FykPl831pKsEyvOt-yfV903fQZ207LIph7PsxQlKVh0dK9xzNK9pxHK4r3nbDdTtR5LXw3VVyInVPntLct1kD0lAASSYDhljgGBdDAJB9UUdx0J8ABhAYUAALzRWks0JCRDWEsS-3CYDIyaEc5NE8DFJ5PkO1EAT4CwtSzjI441LtS1KLUmiELgeVLPlWUxTWeArjMWoDCQEgTyOADZR4SAmBhZ8FBjELQrCsLBSYmBLGVVV1U47ibKMLVdXs4BLCc8w4HSFANE8nzhkbGBn1CIoAHYAA4ADZwjo8QgA


https://stackoverflow.com/questions/62075694/jsx-element-type-string-is-not-a-constructor-function-for-jsx-elements-typesc

