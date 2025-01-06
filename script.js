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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = function (movement) {
  containerMovements.innerHTML = '';

  movement.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>   
          <div class="movements__value"> ${mov}   </div>
        </div>
`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

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

// const userName = user.split(' ');
// let initial = '';
// userName.forEach(function (naming) {
//   initial += naming.toLowerCase().slice(0, 1);
//   console.log(initial);
// });
// console.log(initial);
// console.log(userName);

displayMovements(account1.movements);

// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

// console.log(withdrawals);
console.log(movements);
const balance = movements.reduce(function (acc, cur, i, arr) {
  return acc + cur;
});

console.log(balance);

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
