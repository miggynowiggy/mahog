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

average();
number strs = sum(2, 3, 5, 4);

cycle (number index = 0; index + strs < N; index++) {
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
number _num = 2;
stone wawThisIsLong = 21;
number wow = 123456789.987654321;
number waw = ~12.213;
number there = ~900;
number arr = [1,2,3];
string names = ['Alec',"Miggy","Juan miggy\\"waw\\""];
number twoD = [[1,2,3],[4,5,6],[7,8,9]];
boolean isLegal = true;
isLegal = false;
boolean isOk;

object miggy = {
	string name: "Miggy",
	number age: 21,
	boolean isLegal: true,
	string subjs: ["CS", "IT", "MIS"],
};

miggy.subjs[1] = "IT WAW";

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

isOk = true;

if(isOk) {
	carve("nice");
} elif(isOk && (_num == 2)) {
	carve("nice nice");
} else {
	carve("nice x3");
}

cycle(number num1 = 2; isOk; num1++) {
  carve(num1);
  if(num1 == 5) {
    isOk = false;
  }
}

number ctr = 0;
during(isOk || (ctr < 3)){
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

miggy.name = 'migmig';
miggy.subjs[1] = "CS Elective";
@miggy.subjs.absorb("CYBSEC");
`;

export const code3 = `
number num1;
number orig;
number rev;
number rem;
number numbers = [1, 2, 3, 4, 5];

numbers.absorb(6);
numbers.insert(2, 2.5);
numbers.uproot(1);

string response = water("Enter a number: ");
orig = num(response);
num1 = num(response);

number sum(number x, number n){
  carve("sum of " + str(x) + " and " + str(n) + " is " + str(x + n));
  return x + n;
}

sum(1,2);

during(num1 > 0) {
  rem = num1 % 10;
  rev = rev * ~10 + rem;
  num1 = num1 / 10;
}

if (orig == rev) {
  carve("Reverse is equal to original");
}
else {
  carve("Reverse is not equal to original");
}

cycle(number i = 0; i < 10; i++) {
  carve("numbers[" + str(i) + "]: " + str(numbers[i]) );
}

object student1 = {
  string name: 'Dela Cruz',
  number grade: 2.25,
};

student1.name = 'Anton';
student1.grade = 2.00;
`;