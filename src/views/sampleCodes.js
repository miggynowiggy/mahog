export const code1 = `
seed something;
seed _num = "2";
stone wawThisIsLong = 21;
number wow = 123456789.987654321;
number waw = ~12.213;
number there = ~900;
boolean isLegal = true;
names = ["Some", "Valuable", "String"];
`;

export const code2 = `
seed something;
seed _num = "2";
stone wawThisIsLong = 21;
number wow = 123456789.987654321;
number waw = ~12.213;
number there = ~900;
number arr = [1,2,3];
string names = ['Alec',"Miggy","Juan miggy\\"waw\\""];
number twoD = [[1,2,3],[4,5,6],[7,8,9]];
boolean isLegal = true;
isLegal = false;

twoD.absorb([1, 3, 2]);
twoD.insert(2, [1]);
twoD.uproot();

@this is some comment

@?
multi
line-height
comments
?@

if(isOK) {
	carve("nice");
} elif(isOK && num1 == 2) {
	carve("nice nice");
} else {
	carve("nice x3");
}

cycle(number num1 = 2; isOK; num1++) {
  carve(num1);
  if(num1 == 5) {
    isOK = false;
  }
}

isOK = true;
number ctr = 0;
during(!(!isOK) || (ctr < 3)){
  carve(arr[ctr]);
  ctr--;
}

number func(number x, number y) {
  return x + y;
}

carve('hehe');

string myNum = water("Enter num: ");

object miggy = {
	string name: "Miggy",
	number age: 21,
	boolean isLegal: true,
	string subjs: ["CS", "IT", "MIS"],
};
`;