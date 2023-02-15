'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Salih Can Çakar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Deniz Kanat',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Alper Peker',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Mehmet Memiş',
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

const updateUI = (currAcc) => {
  //Display Mov
  displayMovements(currAcc);

  //Display Balance
  calcDisplayBalance(currAcc);

  //Display Summary
  calcDisplaySummary(currAcc);
};

// İşlerimlerin sırayla gösterilmesi
const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>

    <div class="movements__value">${mov} €</div>
  </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
// username oluşturma
const createNames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((acc) => acc[0])
      .join('');
  });
};

createNames(accounts);

// Hesap bakiye, girdi, çıktı işlemleri
const calcDisplayBalance = (acc) => {
  acc.balance = Number(acc.movements.reduce((a, b) => a + b, 0));

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = (account) => {
  const summaryPositive = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${summaryPositive}€`;

  const summaryNegative = Math.abs(
    account.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${summaryNegative}€`;

  const deposit = account.movements
    .filter((m) => m > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((x) => x > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${deposit}€`;
};

// Login işlemleri
let currentAccount;

//Login butonu

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
  }
  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = ''; // Giriş yaptıktan sonra değeri 0ladık.

  inputLoginPin.blur(); // Giriş yaptıktan sonra cursor blink kapatıldı

  updateUI(currentAccount);
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  const checkAmountByMov = currentAccount.movements.some(
    (mov) => mov >= amount * 0.1
  );

  if (amount > 0 && checkAmountByMov) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Transfer Butonu

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  inputTransferAmount.blur();

  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);

    receiverAccount.movements.push(transferAmount);

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    currentAccount.username == inputCloseUsername.value &&
    currentAccount.pin == Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    alert(`${currentAccount.owner} Deleted`);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
