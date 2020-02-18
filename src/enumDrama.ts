//https://stackoverflow.com/questions/56370727/using-an-enum-to-define-a-list-of-keys-on-an-interface
//https://stackoverflow.com/questions/56626016/using-enums-as-a-generic-type

enum MyEnum {
    FOO, 
    BAR, 
    BIZ, 
    BANG
}; 

type EnumMap = Record<MyEnum, string>; 

//USING ENUM AS KEYS OF AN OBJECT

//This works, but you need to have every enum value on the map. 
const myMap: EnumMap = {
    [MyEnum.FOO]: "foo", 
    [MyEnum.BAR]: "bar", 
    [MyEnum.BIZ]: "biz", 
    [MyEnum.BANG] : "bang", 
}; 

//But what if we want to be using multiple enums, and using enum as a generic? 
enum OtherEnum {
    BING, 
    BONG, 
    BOO, 
}

type GenericEnumMap<T extends number> = Record<T, string>; 

const myGenericEnum1: GenericEnumMap<MyEnum> = {
    [MyEnum.FOO]: "foo", 
    [MyEnum.BAR]: "bar", 
    [MyEnum.BIZ]: "biz", 
    [MyEnum.BANG] : "bang", 
}; 

//Ok, this works ok. 
const myGenericEnum2: GenericEnumMap<OtherEnum> = {
    [OtherEnum.BING]: "bing", 
    [OtherEnum.BONG]: "bong", 
    [OtherEnum.BOO] : "boo"
}; 

//USING ENUM AS VALUES OF A MAP
type MapOfEnumValues = Record<string, MyEnum>; 

//I'm not sure why I thought this was so hard. 
const myMapOfEnumValues: MapOfEnumValues = {
    a: MyEnum.BANG,
    b: MyEnum.BANG,
    c: MyEnum.BAR, 
    d: OtherEnum.BONG //Should error 
}; 

type GenericMapOfEnumValues<T extends number> = Record<string, T>; 

const myGenericMapofEnumValues : GenericMapOfEnumValues<OtherEnum> = {
    a: OtherEnum.BOO, 
    b: OtherEnum.BONG, 
    c: MyEnum.BAR //Should error
}
