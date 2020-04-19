

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

