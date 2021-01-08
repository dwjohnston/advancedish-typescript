
React.memo appears to have a bug. 

https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087


A workaround is to use this snippet: 


```
export const typedMemo: <T extends ComponentType<any>>(
  c: T,
  areEqual?: (
    prev: React.ComponentProps<T>,
    next: React.ComponentProps<T>
  ) => boolean
) => T = React.memo;
```

The right way to use React.memo or this typedMemo is to allow typescript to infer the types, you don't need to specify anything. 


eg: 

```
    const SomeComponent = (props: Props) => {

    }; 

    const MemoizedSomeComponent = memo((props: Props) => {

    });

    const SomeComponentWithGeneric = <T extends Foo>(props: Props<T>) => {

    } 

    const MemoizedSomeComponentWithGeneric = memo(<T extends Foo>(props: Props<T>) => {
        
    }); 

```