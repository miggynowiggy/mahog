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
twoD.uproot(2);

@this is some comment
@waw comment

waw = 12;

@?
multi
line-height
comments
?@

if(isOK) {
	carve("nice");
} elif(isOK && (_num == "2")) {
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

  if (isOk) {
    skip;
  } else {
    break;
  }

  ctr--;
}

number func(number x, number y) {
  return x + y;
}

carve('hehe');

string myNum = water("Enter num: ");

carve(myNum.atChar('a'));
carve(myNum.atPos(3));
carve(myNum.atChar(myNum.atPos(2)));

object miggy = {
	string name: "Miggy",
	number age: 21,
	boolean isLegal: true,
	string subjs: ["CS", "IT", "MIS"],
};
`;

export const code3 = `
number grades = [89 + 1, 90, 91, 92, 79, id];

if (grades[0] >= 90) {
  carve("nice grades!");
} elif ((grades[0] >= 80) && (grades[0] <= 89)) {
  carve("still nice though...");
} else {
  number N = size(grades);
  number index = 0;
  during(index < N) {
    carve("GRADE " + (index + 1) + ": " + grades[index]);
  }
}
`;