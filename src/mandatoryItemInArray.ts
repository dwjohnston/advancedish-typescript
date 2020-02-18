//https://stackoverflow.com/questions/60273099/define-an-array-has-having-a-mandatory-value-plus-optional-others

export type Role = "staffroom_access" | "sportsroom_access"; 

type Teacher = {
    name: string; 
    privileges: ["staffroom_access", ...Role[]];
}

type Student = {
    name: string; 
    privileges: Role[]; 
}

const mrJones: Teacher = {
    name: "Mr Jones",
    privileges: [] //Should error
}; 

const mrSmith: Teacher = {
    name: "Mr Smith",
    privileges: ["staffroom_access"] //Should be Ok 
}; 

const mrKlean: Teacher = {
    name: "Mr Klean",
    privileges: ["staffroom_access", "sportsroom_access"] //Should be Ok 
}; 