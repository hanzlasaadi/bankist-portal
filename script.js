'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
let sort = 'afterbegin'; //beforeend-afterbegin

const formatDate = function (crrDate) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  // console.log(calcDaysPassed(new Date(), crrDate));

  const year = crrDate.getFullYear();
  const month = `${crrDate.getMonth() + 1}`.padStart(2, 0);
  const date = `${crrDate.getDate()}`.padStart(2, 0);

  return `${date}/${month}/${year}`;
};

const movementslist = function (acc, sorted = false) {
  // console.log(acc);
  containerMovements.innerHTML = '';
  const sortedMov = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  sortedMov.forEach(function (value, i, arr) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    // console.log(arr);
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${value}</div>
    </div>
    `;

    // btnSort.addEventListener('click', function () {
    //   if (sort == 'beforeend') sort = 'afterbegin';
    //   else sort = 'beforeend';
    //   containerMovements.insertAdjacentHTML(`${sort}`, html);
    //   console.log(sort);
    // });

    containerMovements.insertAdjacentHTML(`${sort}`, html);
  });
};

// movementslist(account1.movements);

// Map method to get usernames
const getUsername = function (wholeAccounts) {
  wholeAccounts.forEach(function (unitAccount) {
    unitAccount.username = unitAccount.owner
      .toLowerCase()
      .split(' ')
      .map(one => one[0])
      .join('');
  });
};
getUsername(accounts);

const balanceCalc = function (acc) {
  const balance = Math.floor(acc.movements.reduce((acc, mov) => acc + mov, 0));
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};
// balanceCalc(account1.movements);

const displaySummary = function (account) {
  const outgoing = Math.trunc(
    Math.abs(
      account.movements
        .filter(val => val < 0)
        .reduce((acc, crr) => acc + crr, 0)
    )
  );
  labelSumOut.innerHTML = `${outgoing}€`;

  const incoming = Math.trunc(
    Math.abs(
      account.movements
        .filter(val => val > 0)
        .reduce((acc, crr) => acc + crr, 0)
    )
  );
  labelSumIn.innerHTML = `${incoming}€`;

  const interest = account.movements
    .filter(val => val > 0)
    .map(val => (val * account.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, crr) => acc + crr, 0);
  labelSumInterest.innerHTML = `${Math.floor(interest)}€`;
};
// displaySummary(account1.movements);

const displayUI = function (CrAcc) {
  //display balance
  balanceCalc(CrAcc);
  //display summary
  displaySummary(CrAcc);
  //display movements
  movementslist(CrAcc);
};

// Event Handlers
let currentAccount;
currentAccount = account1;
displayUI(account1);

const now = new Date();
const year = now.getFullYear();
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const date = now.getDate().toString().padStart(2, 0);
const hours = now.getHours();
const minutes = now.getMinutes();

document.querySelector('.date').innerHTML = `${date}/${month}/${year}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevent reload

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('Logged In');
    //display UI/Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100; //fade in
    inputLoginPin.value = inputLoginUsername.value = ''; //Empty input fields
    inputLoginPin.blur(); //lose focus input field pin

    displayUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const balance = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    val => val.username === inputTransferTo.value
  );

  if (
    balance > 0 &&
    currentAccount.balance >= balance &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    receiverAcc.movements.push(balance);
    currentAccount.movements.push(-balance);

    displayUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      val => val.username === currentAccount.username
    );
    accounts.splice(index, 1); //Delete Current Account---LOG OUT

    containerApp.style.opacity = 0; //Hide UI
    console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAsk = Number(inputLoanAmount.value);

  const anyDepositPerc = currentAccount.movements.some(
    val => loanAsk * 0.1 <= val > 0
  );

  if (anyDepositPerc && loanAsk > 0) {
    setTimeout(function () {
      currentAccount.movements.push(loanAsk);
      displayUI(currentAccount);
      inputLoanAmount.blur();
    }, 5000);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  movementslist(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(+'23');

//Parsing;;;
console.log(parseInt('2px'));
console.log(Number.parseInt('243px'));
console.log(Number.parseFloat('6.76rem'));

//Check if value is not a number
console.log(Number.isNaN('243'));
console.log(Number.isNaN(27));
console.log(Number.isNaN(+'234x'));
console.log(Number.isNaN(parseInt('234x')));

//Check if value is number
console.log(Number.isFinite(23));
console.log(Number.isFinite('23'));
console.log(Number.isFinite(+'23'));
console.log(Number.isFinite(+'23px'));
console.log(Number.isFinite(22 / 7));

console.log(Number.isInteger(23)); //no point values
console.log(Number.isInteger('23'));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(22 / 7)); //3.14

// Random Numbers & Math.methods;;;

console.log(Math.max(1, 3, 5, 7, 9));
console.log(Math.max(1, 3, 5, 7, '9')); //type coersion is automatic
console.log(Math.max(1, 3, 5, 7, '9px')); //but parsing is not automatic

console.log(Math.min(2, 8, 64, 323, 63523, 22));

console.log(Math.PI);
console.log(Math.PI * parseInt('12px') ** 2); // pi_r_square => area of circle by it's radius

//random number between max & min FUNCTION
const randomMaxMin = (max, min) =>
Math.trunc(Math.random() * (max - min) + 1) + min; //0...1 -> 0...(max-min) -> 0+min...max-min+min -> min...max
console.log(randomMaxMin(20, 10));

// Dates;;;
console.log(new Date()); //create current daate/time

console.log(new Date(0)); //unix time started in 1970
console.log(Date.now()); // time passes since 1970

console.log(new Date('december 16, 1970')); //create date with string of date
console.log(new Date(1969, 11, 16, 3, 23)); //create date with numbers of years to milisecs(order)

console.log(new Date(account1.movementsDates[0]));

const past = new Date(1969, 11, 16, 3, 23);
console.log(past.getFullYear());
console.log(past.getMonth());
console.log(past.getDate());
console.log(past.getDay());
console.log(past.getMinutes());
console.log(past.getSeconds());
console.log(past.getMilliseconds());

console.log(past.toISOString()); //good formaat of dates used by JavaScript

const clock = setInterval(() => {
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  console.log(`${date}/${month}/${year} ${hours}:${min}:${sec}`);
}, 1000);
*/
