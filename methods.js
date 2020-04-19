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


const ksTest = (sampleData, alpha) => {

    // N elements in the sample data
    var n = sampleData.length;

    // Harcoded dictionary for the critic values
    var criticValues = {
        '0.001': [NaN, 0.97764, 0.92063, 0.85046, 0.78137, 0.72479, 0.6793, 0.64098, 0.06846, 0.58042, 0.55588, 0.53422, 0.51490, 0.49753, 0.48182, 0.4675, 0.4544, 0.44234, 0.43119, 0.42085],
        '0.01': [0.995, 0.9293, 0.829, 0.73421, 0.66855, 0.6166, 0.5758, 0.5418, 0.5133, 0.48895, 0.4677, 0.44905, 0.43246, 0.4176, 0.4042, 0.392, 0.38085, 0.37063, 0.36116, 0.3524],
        '0.02': [0.99, 0.9, 0.78456, 0.68887, 0.62718, 0.57741, 0.53844, 0.50654, 0.4796, 0.45662, 0.4367, 0.41918, 0.40362, 0.3897, 0.37713, 0.36701, 0.35528, 0.34569, 0.33685, 0.32866],
        '0.05': [0.975, 0.84189, 0.7076, 0.62394, 0.56327, 0.51926, 0.48343, 0.45427, 0.43001, 0.40925, 0.39122, 0.37543, 0.36143, 0.3489, 0.3376, 0.32733, 0.31796, 0.30936, 0.30142, 0.29407],
        '0.1': [0.95, 0.77369, 0.63604, 0.56522, 0.50945, 0.46799, 0.43607, 0.40962, 0.38746, 0.36866, 0.35242, 0.33815, 0.32548, 0.31417, 0.30397, 0.29471, 0.28627, 0.27851, 0.27135, 0.26473],
        '0.15': [0.925, 0.72614, 0.59582, 0.52476, 0.47439, 0.43526, 0.40497, 0.38062, 0.36006, 0.3425, 0.32734, 0.31408, 0.30233, 0.29181, 0.28233, 0.27372, 0.26587, 0.25867, 0.25202, 0.24587],
        '0.2': [0.9, 0.68377, 0.56481, 0.49265, 0.44697, 0.41035, 0.38145, 0.35828, 0.33907, 0.32257, 0.30826, 0.29573, 0.28466, 0.27477, 0.26585, 0.25774, 0.25035, 0.24356, 0.23731, 0.23152]
    };

    // Critic value for the model based on the number of elements in the sample data and the alpha value
    var criticValue = criticValues[alpha][n - 1];

    // Sort from lowest to highest
    sampleData.sort(function(a, b) { return a - b });

    // Define all the arrays for the calculation table
    var avgPerPosition = Array(n);
    var dPlus = Array(n);
    var dMinus = Array(n);

    // Maximum values inside arrays for comparing the final max value with the critic value
    var dPlusMax;
    var dMinusMax;
    var finalMax;

    // Detection for missing data and stopping the test
    var error = 0;

    for (i = 0; i < n; i++) {
        if ((!isNaN(parseFloat(sampleData[i].value)))) {
            alert("Data entry error");
            e++;
            return false;
        }
        avgPerPosition.push(parseFloat(i + 1 / sampleData[i].value));
        dPlus.push(avgPerPosition[i] - sampleData[i].value);
        dMinus.push(sampleData[i].value - i / sampleData[i].value);
    }

    if (e > 0) {
        alert("Data entry error");
        return false;
    }

    dPlusMax = Math.max(...dPlus);
    dMinusMax = Math.max(...dMinus);

    finalMax = Math.max(dPlusMax, dMinusMax);

    if (finalMax <= criticValue) {
        print("The hypothesis is not rejected, since " + finalMax + " is less or equal than the critic value " + criticValue);
        return true;
    } else {
        print("The hypothesis is rejected, since " + finalMax + " is higher than the critic value " + criticValue);
        return false;
    }
}; //function closing