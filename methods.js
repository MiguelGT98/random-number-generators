/* Middle Square Method */

const middleSquareMethod = (seed, n) => {
  const randomNumbers = [];

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      randomNumbers.push(middleSquareMethodGenerator(seed));
    } else {
      randomNumbers.push(middleSquareMethodGenerator(randomNumbers[i - 1]));
    }
  }

  return randomNumbers.map((number) => {
    return number / 10000;
  });
};

const middleSquareMethodGenerator = (previous) => {
  const squared = previous * previous;
  const squaredPadded = padStart(squared.toString(), 8);

  return parseInt(squaredPadded.substr(2, 4));
};

const padStart = (numberString, length) => {
  while (numberString.length < length) {
    numberString = "0" + numberString;
  }

  return numberString;
};

/* Example usage */
/* console.log(middleSquareMethod(4399, 10)); */

/* Linear Congruential Method */

const linearCongruentialMethod = (seed, a, c, m, n) => {
  const randomNumbers = [];

  for (let i = 0; i < n; i++) {
    if (i === 0) {
      randomNumbers.push(linearCongruentialMethodGenerator(seed, a, c, m));
    } else {
      randomNumbers.push(
        linearCongruentialMethodGenerator(randomNumbers[i - 1], a, c, m)
      );
    }
  }

  return randomNumbers.map((number) => {
    return number / m;
  });
};

const linearCongruentialMethodGenerator = (previous, a, c, m) => {
  return (a * previous + c) % m;
};

/* Example usage */
/* linearCongruentialMethod(4, 5, 7, 8, 8)); */

/* Multiplicative Congruential Method */
const multiplicativeCongruentialMethod = (a, xi, m, n) => {
  const randomNumbers = [];
  for (i = 0; i < n; i++) {
    let xn = (a * xi) % m;
    xi = xn;
    randomNumbers.push(xn / (m - 1));
  }
  return randomNumbers;
};
/* Example usage */
/* multiplicativeCongruentialMethod(515, 2657, 34359738368, 100)); */

/* Mixed Linear Congruential Method */

const mixedLinearCongruentialMethod = (seed, a, c, m, n) => {
  if (!satisfiesHullDobell(a, c, m)) {
    return -1;
  }

  return linearCongruentialMethod(seed, a, c, m, n);
};

const satisfiesHullDobell = (a, c, m) => {
  if (gcd(c, m) !== 1) return false;

  const primeNumbers = primeFactors(m);
  for (let i = 0; i < primeNumbers.length; i++) {
    if ((a - 1) % primeNumbers[i] !== 0) return false;
  }

  if (m % 4 === 0) {
    if ((a - 1) % 4 !== 0) return false;
  }

  return true;
};

const gcd = (a, b) => {
  if (a === 0 || b === 0) return 0;

  while (a !== b) {
    if (a > b) {
      a = a - b;
    } else {
      b = b - a;
    }
  }

  return a;
};

const primeFactors = (n) => {
  const primeNumbers = [];

  while (n % 2 == 0) {
    primeNumbers.push(2);
    n = n / 2;
  }

  for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
    while (n % i == 0) {
      primeNumbers.push(i);
      n = n / i;
    }
  }

  if (n > 2) primeNumbers.push(n);

  return primeNumbers;
};

/* Example usage */
/* mixedLinearCongruentialMethod(4, 5, 7, 8, 8)); */

/* Combined Linear Congruential Method */

const combinedLinearCongruentialMethod = (generators, n, lastMod) => {
  for (let i = 0; i < 2; i++) {
    const seed = generators[i].parameters.seed;
    const a = generators[i].parameters.a;
    const c = generators[i].parameters.c;
    const m = generators[i].parameters.m;

    generators[i].randomNumbers = linearCongruentialMethod(seed, a, c, m, n);
  }

  const randomNumbers = [];

  for (let i = 0; i < n; i++) {
    const r1 = generators[0].randomNumbers[i] * generators[0].parameters.m;
    const r2 = generators[1].randomNumbers[i] * generators[1].parameters.m;
    const r3 = r1 - r2;

    if (r3 < 0) {
      randomNumbers.push((r3 + lastMod) / lastMod);
    } else {
      randomNumbers.push((r3 % lastMod) / lastMod);
    }
  }

  return randomNumbers;
};

/* Example usage */
/* 
const g = [
  { parameters: { seed: 1, a: 3, c: 0, m: 5 } },
  { parameters: { seed: 3, a: 5, c: 0, m: 7 } },
];
console.log(combinedLinearCongruentialMethod(g, 15, 7)); 
*/
