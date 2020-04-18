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