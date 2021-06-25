export const code1 = `number b = 2 + (21 / 3);
number grades = [90, 88, 90, 87, 85];
stone name = "miggy";

number N = 5;

string enteredName = water("What is your name?: ");

if (grades[0] >= 91) {
  carve("excellent grade");

} elif (grades[0] >= 85 && grades[0] <= 90) {
  carve("good grade");

} else {
  carve("better luck next time");
}

object subj1 = {
  string name: enteredName,
  number grade: 1.00,
};

number sum(number a, number b) {
  number nums = [1, 2, 3];
  number grade = 2 + subj1.grade;
  return nums[0] + grade;
}

number average() {
  number sum2 = 0;
  cycle (number gradeIndex = 0; gradeIndex < N; gradeIndex++) {
    sum2 += grades[gradeIndex];
  }
  return sum2 / N;
}


cycle (number index = 0; index < N; index++) {
  carve(grades[index]);
}

number anotherIndex = 0;

anotherIndex = 1 + 2;

during(anotherIndex < N) {
  carve(grades[anotherIndex]);
}

`;

export const code2 = `
number something;
number _num = "2";
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
number arr = [2, 3, 1];
number b = [12];
number a = arr[2 + 23 + (2 / 2) + b[0]];
number grades = [(89 + 90 + (91 + (91 / 2))) + 1, 90, [91, 92], 79];
string names = ["waw", "galing", ("galing" + "ano" + ("ahh" + ("ehh" + "nays")))];
string name = "miggy";
boolean test = "nays" != "sakto";
`;