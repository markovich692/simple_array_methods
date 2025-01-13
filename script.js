'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'premium',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');

const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//APPLICATION

// const displayMovements = function (movement) {
//   containerMovements.innerHTML = '';

//   movement.forEach(function (mov, index) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
// <div class="movements__row">
//           <div class="movements__type movements__type--${type}">${
//       index + 1
//     } ${type}</div>
//           <div class="movements__value"> ${mov}   </div>
//         </div>
// `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

//DISPLAY MOVEMENTS
const displayMovements = function (movement, sort = false) {
  containerMovements.innerHTML = '';

  console.log(movement);

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //creates HTML strings
    const html = `
<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__value"> ${mov}€   </div>
        </div>
`;

    //Inserts HTML strings
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//DISPLAY BALANCE

const calcDisplayBalance = function (acc) {
  labelBalance.textContent = '';

  //calculate the balance
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//DISPLAY SUMMARY

const calcDisplaySummary = function (acc) {
  const eurTousd = 1.1;
  //Total in
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  //Total out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  //Total interest

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//CREATE USERNAME PROPERTY
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    //Create a new property for each account
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

//adds the username property to each of the account
createUsernames(accounts);

//UPDATE UI

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  // calcDisplaySummary(currentAccount.movements);
  calcDisplaySummary(acc);
};

//LOGIN
//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.dir(inputLoginPin);

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    //Display Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //Sets the opacity back to 1 when we log in
    containerApp.style.opacity = 1;

    //UPDATE UI
    updateUI(currentAccount);
  }
});

//TRANSFER
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  // inputTransferTo.value = '';
  // inputTransferAmount.value = '';
  //Find the account that receives the transfer

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Adds the value to the receiver movements array
  console.log(currentAccount.balance);

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  //Transfer conditions
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);
  }

  //UPDATE UI
  updateUI(currentAccount);
});

//CLOSING
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const closeAccountIndex = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );

    console.log(closeAccountIndex);

    accounts.splice(closeAccountIndex, 1);

    //Restore UI
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//REQUEST LOAN

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  const loanCondition = currentAccount.movements.some(
    mov => mov >= amount / 10
  );

  if (amount > 0 && loanCondition) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//SORTING FUNCTIONALITY

let sort = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sort);

  sort = !sort;
});

//PROPERTY
// const userName = user.split(' ');
// let initial = '';
// userName.forEach(function (naming) {
//   initial += naming.toLowerCase().slice(0, 1);
//   console.log(initial);
// });
// console.log(initial);
// console.log(userName);

// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const findAccount = accounts.find(account => account.username === 'js');
// console.log(findAccount);

// for (const acc of accounts) {
//   // console.log(acc);
//   if (acc.owner === 'Steven Thomas Williams') {
//     console.log(acc);
//   }
// }

// accounts.forEach(function (mov, index, array) {
//   if (mov.owner === 'Steven Thomas Williams') {
//     console.log(mov);
//   }
// });

// const eurTousd = 1.1;
//PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurTousd)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(totalDepositsUSD);

//Maximum value

// const max = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );

// console.log(max);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

//accumulator => SNOWBALL
// console.log(movements);
// //USING the reduce method to calculate the current balance
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);

//   return acc + cur;
// }, 0);

// console.log(balance);
//USING the for...of loop to calculate the current balance
// let sum = 0;
// for (const mov of movements) {
//   sum += mov;
// }

// console.log(sum);

// for (const movement of movements) {
//   movement > 0
//     ? console.log(`You deposited ${movement}`)
//     : console.log(`You withdrew ${Math.abs(movement)}`);
// }

// console.log('--FOR-EACH--');

// movements.forEach(function (movement, index) {
//   movement > 0
//     ? console.log(`Movement ${index + 1}: You deposited ${movement}`)
//     : console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'USD', 'GBP', 'GBP', 'EUR']);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, key, set) {
//   console.log(`${key}: ${value}`);
//   console.log(set);
// });

// Coding Challenge #1
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each).
// For now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'),
// and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have cats, not dogs!
// So create a shallow copy of Julia's array, and remove the cat ages from that copied array
// (because it's a bad practice to mutate function parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog,log to the console whether it's an adult ("Dognumber1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy   ")
// 4. Run the function for both test data sets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3] § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far 😉

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCopy = [...dogsJulia];
//   dogsJuliaCopy.splice(-2);
//   dogsJuliaCopy.splice(0, 1);

//   console.log(dogsJuliaCopy);
//   const arrayKateJulia = dogsJuliaCopy.concat(dogsKate);

//   arrayKateJulia.forEach(function (age, index) {
//     const isAdult = age >= 3 ? 'is an adult' : 'is still a puppy';

//     console.log(`Dognumber ${index + 1} ${isAdult}, and is ${age} years old`);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// const newArray = movements.map(movement => movement * 2);

// const eurTousd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurTousd);

// console.log(movementsUSD);

// const movementsUSD = [];

// for (const movement of movements) {
//   console.log(movement);
//   const conversionUSD = movement * eurTousd;
//   movementsUSD.push(conversionUSD);
// }

// console.log(movementsUSD);

//.forEach() method
// movements.forEach(function (movement, index) {
//   movement > 0
//     ? console.log(`Movement ${index + 1}: You deposited ${movement}`)
//     : console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
// });

// //.map() method
// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription);

//CODING CHALLENGE 2
// Let's go back to Julia and Kate's study about dogs. This time,
// they want to convert dog ages to human ages and calculate the
// average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'),
// and does the following things in order:
// 1. Calculate the dog age in human years using the following formula:
// if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old
// (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs(you should already
// know from other challenges how we calculate averages 😉)
// 4. Run the function for both test data sets
// Test data:
// § Data1:[5,2,4,1,15,8,3] § Data2:[16,6,10,5,6,1,4]

// const calcAverageHumanAge = function (ages) {
//   //Calculate human ages
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

//   //Removes dogs that are not 18 years of age

//   const adultHumanAgeDog = humanAges.filter(humanAge => humanAge >= 18);

//   //Calculate the average human age of all adult dogs

//   const averageHumanAge = adultHumanAgeDog.reduce(
//     (acc, cur, i, arr) => acc + cur / arr.length,
//     0
//   );

//   return averageHumanAge;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//CODING CHALLENGE 3
// Rewrite the 'calcAverageHumanAge' function from Challenge #2,
// but this time as an arrow function, and using chaining!

// const calcAverageHumanAge1 = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// console.log(calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]));

//LOGIN
// let isActive = false;

// containerApp.style.opacity = 0;

//CREATES THE LOGIN BEHAVIOR

// btnLogin.addEventListener('click', function (event) {
//   // console.log(event);
//   event.preventDefault();

//   const retrieveAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );

//   if (
//     Boolean(retrieveAccount) &&
//     retrieveAccount.pin === Number(inputLoginPin.value)
//   ) {
//     //Removes credentials

//     inputLoginUsername.value = '';
//     inputLoginPin.value = '';

//     //Display Name

//     labelWelcome.textContent = `Welcome, ${
//       retrieveAccount.owner.split(' ')[0]
//     }`;

//     //Display movements

//     console.log('Logged In');
//     const displayMovements = function (movement) {
//       containerMovements.innerHTML = '';

//       movement.forEach(function (mov, index) {
//         const type = mov > 0 ? 'deposit' : 'withdrawal';

//         //creates HTML strings
//         const html = `
//   <div class="movements__row">
//             <div class="movements__type movements__type--${type}">${
//           index + 1
//         } ${type}</div>
//             <div class="movements__value"> ${mov}€   </div>
//           </div>
//   `;
//         //Inserts HTML strings
//         containerMovements.insertAdjacentHTML('afterbegin', html);
//       });
//     };

//     displayMovements(retrieveAccount.movements);
//   }

//   //DISPLAY BALANCE

//   const calcDisplayBalance = function (movements) {
//     labelBalance.textContent = '';

//     //calculate the balance
//     const balance = movements.reduce((acc, cur) => acc + cur, 0);

//     labelBalance.textContent = `${balance}€`;
//   };

//   calcDisplayBalance(retrieveAccount.movements);

//   //DISPLAY SUMMARY

//   const calcDisplaySummary = function (movements) {
//     const eurTousd = 1.1;

//     //Total in
//     const incomes = movements
//       .filter(mov => mov > 0)
//       .reduce((acc, mov) => acc + mov, 0);

//     labelSumIn.textContent = `${incomes}€`;

//     //Total out
//     const out = movements
//       .filter(mov => mov < 0)
//       .reduce((acc, mov) => acc + mov, 0);
//     labelSumOut.textContent = `${Math.abs(out)}€`;

//     //Total interest

//     const interest = movements
//       .filter(mov => mov > 0)
//       .map(deposit => (deposit * 1.2) / 100)
//       .filter(int => int >= 1)
//       .reduce((acc, int) => acc + int, 0);

//     labelSumInterest.textContent = `${interest}€`;
//   };

//   calcDisplaySummary(retrieveAccount.movements);

//   containerApp.style.opacity = 1;
// });

// //CREATE USERNAME PROPERTY
// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     //Create a new property for each account
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };

// //adds the username property to each of the account
// createUsernames(accounts);

// const arrTest = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// console.log(arrTest.splice(3));

// console.log(arrTest);

// const str = 'Jesus Navas';
// const arrTest2 = ['a', 'b', 'c', 'd', 'e'];
// console.log(arrTest2.indexOf('c'));

// const obj = { a: 1, b: 2 };
// console.log(Object.keys(obj));

// console.log(movements);

// const largeMovements = movements.findLast(mov => mov > 1000);
// const largeMovementsIndex = movements.findLastIndex(
//   mov => Math.abs(mov) > 1000
// );
// console.log(
//   `Your latest large movements of ${largeMovements} occurred ${
//     movements.length - largeMovementsIndex
//   } movements ago.`
// );

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// console.log(movements);

// const condition = mov => mov > 0;
// const onlyDeposit = account4.movements.every(condition);

// console.log(onlyDeposit);

// const arrTest = [[1, 2, 3], [4, 5, 6], 7, 8];

// const totalMoves = accounts.map(function (account) {
//   return account.movements;
// });

// console.log(totalMoves.flat());

///////////////////////////////
//CHALLENGE 4

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //Adds the recommended portion property to each dog objects
// dogs.forEach(dog => (dog.recPortion = dog.weight ** 0.75 * 28));

// console.log(dogs);

// //Finds Sarah's dog and check if it's eating too much or too little

// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

// dogSarah.curFood > dogSarah.recPortion
//   ? console.log(`Sarah's dog is eating too much.`)
//   : console.log(`Sarah's dog is eating too little.`);

// //Creates an array of owners, which dogs eat too much
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recPortion)
//   .map(much => much.owners)
//   .flat();

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recPortion)
//   .map(little => little.owners)
//   .flat();

// console.log(ownersEatTooLittle);

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// dogs.some(dog => dog.curFood === dog.recPortion)
//   ? console.log('Some dogs eat exactly the amount of food recommended.')
//   : console.log('None of the dogs eat the amount of food recommended.');

// dogs.some(
//   dog =>
//     (dog.curFood >= dog.recPortion &&
//       dog.curFood <= dog.recPortion + dog.recPortion * 0.1) ||
//     (dog.curFood <= dog.recPortion &&
//       dog.curFood >= dog.recPortion - dog.recPortion * 1)
// )
//   ? console.log('Some dogs eat an okay amount of food.')
//   : console.log('No dogs eat an okay amount of food.');

// const arrEatOkay = dogs.filter(
//   dog =>
//     (dog.curFood >= dog.recPortion &&
//       dog.curFood <= dog.recPortion + dog.recPortion * 0.1) ||
//     (dog.curFood <= dog.recPortion &&
//       dog.curFood >= dog.recPortion - dog.recPortion * 1)
// );

// console.log(arrEatOkay);

// //Create a shallow copy of the dogs array

// console.log(dogs);

// const dogsShallowCopy = dogs.slice();

// for (const dog of dogsShallowCopy.values()) {
//   console.log(dog.curFood);
// }

///////////////////////////////
//The .sort() method

// movements.sort((a, b) => {
//   if (a < b) return -1;

//   if (b < a) return 1;
// });

// console.log(movements);

// const movementsAscending = movements.sort((a, b) => a - b);

// console.log(movementsAscending);

// const groupingDepWith = Object.groupBy(movements, mov =>
//   mov > 0 ? 'deposits' : 'withdrawals'
// );

// console.log(groupingDepWith);

// const groupedByActivity = Object.groupBy(accounts, function (acc) {
//   const movesLength = acc.movements.length;

//   if (movesLength >= 8) return 'very active';
//   if (movesLength >= 5) return 'active';
//   if (movesLength >= 3) return 'moderate';
//   return 'inactive';
// });

// console.log(groupedByActivity);

// const groupByType = Object.groupBy(accounts, function (acc) {
//   const accountType = acc.type;

//   if (accountType === 'standard') return 'standard';
//   if (accountType === 'premium') return 'premium';

//   return 'other';
// });

// console.log(groupByType);

// const staff = [
//   { name: 'Ellie', age: 28 },
//   { name: 'Bob', age: 30 },
//   { name: 'Henry', age: 28 },
//   { name: 'David', age: 30 },
// ];

// //Using the Object.groupBy() to group the staff by age
// const groupedByAge = Object.groupBy(staff, member => member.age);

// console.log(groupedByAge);

// // output : {
// //   28: [
// //     { name: 'Ellie', age: 28 },
// //     { name: 'Henry', age: 28 },
// //   ],
// //   30: [
// //     { name: 'Bob', age: 30 },
// //     { name: 'David', age: 30 },
// //   ],
// // };

// const uniqueName = new Set(['Jonas', 'Jonas', 'Bill', 'Bill', 'Bob']);

// const x = new Array(7);

// console.log(x.fill(1, 2, 4));

// console.dir(Array);

//Generates an array of  a hundred random dice roll
// const diceRollHundred = Array.from({ length: 100 }, function (_, index) {
//   const diceRoll = Math.round(Math.random() * 6) + 1;

//   return diceRoll;
// });

// console.log(diceRollHundred);

// console.log(diceRoll);

// const movementUI = Array.from(
//   document.querySelectorAll('.movements__value'),
//   el => el.textContent.replace('€', '')
// );

// console.log(movementUI);

// console.log(movements);

// console.log(movements);

// const newMovements = movements.with(2, 2000);

// console.log(movements);

// console.log(newMovements);

// Coding Challenge #4

// This time, Julia and Kate are studying the activity levels of different dog breeds.

// YOUR TASKS:
// 1. Store the the average weight of a "Husky" in a variable "huskyWeight"
// 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// 3. Create an array "allActivities" of all the activities of all the dog breeds
// 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions).
//    HINT: Use a technique with a special data structure that we studied a few sections ago.
// 5. Many dog breeds like to swim. What other activities do these dogs like?
//    Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
// 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
// 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities.
//    Log to the console whether "true" or "false".
// BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method
// along with the ... operator.

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

//Store the average weight of the husky in the husky weight variable
const huskyWeight = breeds.find(dog => dog.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//The name of the breed that likes both "running" and "fetch"
const dogBothActivities = breeds.find(function (dog) {
  const dogActivities = dog.activities;

  return dogActivities.includes('running') && dogActivities.includes('fetch');
});

console.log(dogBothActivities);

//Create an array of all activities of all the dog breeds
const allActivities = breeds.flatMap(dog => dog.activities);

console.log(allActivities);

//Create an array containing the unique activities of the dog breed
const uniqueActivities = [...new Set(allActivities)];

console.log(uniqueActivities);

// Store other activities in an array called "swimmingAdjacent"
const swimmingIndex = uniqueActivities.findIndex(function (cur, i, arr) {
  return cur === 'swimming';
});

const swimmingAdjacent = uniqueActivities.toSpliced(swimmingIndex, 1);

console.log(swimmingAdjacent);

//Check if all the breeds have an average weight of 10Kg or more
breeds.every(dog => dog.averageWeight >= 10)
  ? console.log('All the breeds have an average weight greater than 10 or more')
  : console.log('All the breeds have an average weight lower than 10');

//Check if any of the breeds are 'Active' that is if they have more than 3 activities

breeds.some(dog => dog.activities.length >= 3)
  ? console.log('Active')
  : console.log('Not active');

//Find the averageWeight of the heaviest breed that likes to fetch

breeds.find(dog => dog.averageWeight);

const breedsFetchHeaviest = breeds
  .filter(function (cur, index, arr) {
    return cur.activities.includes('fetch');
  })
  .sort((a, b) => a.averageWeight - b.averageWeight)
  .at(-1).averageWeight;

console.log(breedsFetchHeaviest);
