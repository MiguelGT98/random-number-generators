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

//console.log(linearCongruentialMethod(4, 5, 7, 8, 8));

/* Multiplicative Congruential Method */
const multiplicativeCongruentialMethod = (xi, a, m, n) => {
  const randomNumbers = [];
  for (i = 0; i < n; i++) {
    let xn = (a * xi) % m;
    xi = xn;
    randomNumbers.push(xn / m);
  }
  return randomNumbers;
};
/* Example usage */
//console.log(multiplicativeCongruentialMethod(515, 2657, 34359738368, 100));

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

// const g = [
//   { parameters: { seed: 1, a: 3, c: 0, m: 5 } },
//   { parameters: { seed: 3, a: 5, c: 0, m: 7 } },
// ];
// console.log(g)
// console.log(combinedLinearCongruentialMethod(g, 15, 7));

const chiSquareTest = (randomNumbers, alpha) => {
  let criticValues = {
    "0.001": [
      10.82757,
      13.81551,
      16.26624,
      18.46683,
      20.51501,
      22.45774,
      24.32189,
      26.12448,
      27.87716,
      29.5883,
      31.26413,
      32.90949,
      34.52818,
      36.12327,
      37.6973,
      39.25235,
      40.79022,
      42.3124,
      43.8202,
      45.31475,
    ],
    "0.01": [
      6.6349,
      9.21034,
      11.34487,
      13.2767,
      15.08627,
      16.81189,
      18.47531,
      20.09024,
      21.66599,
      23.20925,
      24.72497,
      26.21697,
      27.68825,
      29.14124,
      30.57791,
      31.99993,
      33.40866,
      34.80531,
      36.19087,
      37.56623,
    ],
    "0.02": [
      5.41189,
      7.82405,
      9.83741,
      11.66784,
      13.38822,
      15.03321,
      16.62242,
      18.16823,
      19.67902,
      21.16077,
      22.61794,
      24.05396,
      25.47151,
      26.87276,
      28.2595,
      29.63318,
      30.99505,
      32.34616,
      33.68743,
      35.01963,
    ],
    "0.05": [
      3.84146,
      5.99146,
      7.81473,
      9.48773,
      11.0705,
      12.59159,
      14.06714,
      15.50731,
      16.91898,
      18.30704,
      19.67514,
      21.02607,
      22.36203,
      23.68479,
      24.99579,
      26.29623,
      27.58711,
      28.8693,
      30.14353,
      31.41043,
    ],
    "0.1": [
      2.70554,
      4.60517,
      6.25139,
      7.77944,
      9.23636,
      10.64464,
      12.01704,
      13.36157,
      14.68366,
      15.98718,
      17.27501,
      18.54935,
      19.81193,
      21.06414,
      22.30713,
      23.54183,
      24.76904,
      25.98942,
      27.20357,
      28.41198,
    ],
    "0.15": [
      2.07225,
      3.79424,
      5.31705,
      6.74488,
      8.1152,
      9.4461,
      10.7479,
      12.02707,
      13.28804,
      14.53394,
      15.7671,
      16.98931,
      18.20198,
      19.40624,
      20.60301,
      21.79306,
      22.97703,
      24.15547,
      25.32885,
      26.49758,
    ],
    "0.2": [
      1.64237,
      3.21888,
      4.64163,
      5.98862,
      7.28928,
      8.55806,
      9.80325,
      11.03009,
      12.24215,
      13.44196,
      14.63142,
      15.81199,
      16.9848,
      18.15077,
      19.31066,
      20.46508,
      21.61456,
      22.75955,
      23.90042,
      25.03751,
    ],
  };
  randomNumbers.sort(function (a, b) {
    return a - b;
  });

  let currentNum = randomNumbers[0];
  let observed = 0;
  let observedArray = [];
  let chiSquareResult = 0;

  let chisquareSum = 0;
  for (let num of randomNumbers) {
    if (num == currentNum) {
      observed++;
    } else {
      observedArray.push(observed);
      currentNum = num;
      observed = 1;
    }
  }
  observedArray.push(observed);

  for (let obs of observedArray) {
    let expected = randomNumbers.length / observedArray.length;
    let residual = obs - expected;
    let chiSquare = (residual * residual) / expected;
    chiSquareResult = chiSquare + chiSquareResult;
  }


  //p = probabilidad de que sea aceptada esta vaina
  // p <= alpha la hipotesis es rechazada
  if (observedArray.length > 1) {
    if(chiSquareResult<criticValues[alpha][observedArray.length - 1]){
      return true
    }

    // p = pchisq(chiSquareResult, observedArray.length - 1);
    // console.log("P:", p);
  }
  return false;
};
//Para que no usemos tablas uwu
function pchisq(chi2, n) {
  return gammq(n, 0.5 * chi2);
}

function gammq(n, x) {
  if (x < 0.5 * n + 1) {
    return 1 - gser(n, x);
  } else {
    return gcf(n, x);
  }
}

function gser(n, x) {
  let eps = 1e-6;
  let gln = gamnln(n);
  let a = 0.5 * n;
  let ap = a;
  let sum = 1.0 / a;
  let del = sum;
  for (let n = 1; n < 101; n++) {
    ap++;
    del = (del * x) / ap;
    sum += del;
    if (del < sum * eps) {
      break;
    }
  }
  return sum * Math.exp(-x + a * Math.log(x) - gln);
}

function gcf(n, x) {
  let eps = 1e-6;
  let gln = gamnln(n);
  let a = 0.5 * n;
  let b = x + 1 - a;
  let fpmin = 1e-300;
  let c = 1 / fpmin;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 101; i++) {
    let an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < fpmin) {
      d = fpmin;
    }
    c = b + an / c;
    if (Math.abs(c) < fpmin) {
      c = fpmin;
    }
    d = 1 / d;
    let del = d * c;
    h = h * del;
    if (Math.abs(del - 1) < eps) {
      break;
    }
  }
  return h * Math.exp(-x + a * Math.log(x) - gln);
}

function gamnln(n) {
  // Tabulated values of ln(Gamma(n/2)) for n<201
  let lg = [
    0.5723649429247001,
    0,
    -0.1207822376352452,
    0,
    0.2846828704729192,
    0.6931471805599453,
    1.200973602347074,
    1.791759469228055,
    2.453736570842442,
    3.178053830347946,
    3.957813967618717,
    4.787491742782046,
    5.662562059857142,
    6.579251212010101,
    7.534364236758733,
    8.525161361065415,
    9.549267257300997,
    10.60460290274525,
    11.68933342079727,
    12.80182748008147,
    13.94062521940376,
    15.10441257307552,
    16.29200047656724,
    17.50230784587389,
    18.73434751193645,
    19.98721449566188,
    21.2600761562447,
    22.55216385312342,
    23.86276584168909,
    25.19122118273868,
    26.53691449111561,
    27.89927138384089,
    29.27775451504082,
    30.67186010608068,
    32.08111489594736,
    33.50507345013689,
    34.94331577687682,
    36.39544520803305,
    37.86108650896109,
    39.3398841871995,
    40.8315009745308,
    42.33561646075349,
    43.85192586067515,
    45.3801388984769,
    46.91997879580877,
    48.47118135183522,
    50.03349410501914,
    51.60667556776437,
    53.19049452616927,
    54.78472939811231,
    56.38916764371993,
    58.00360522298051,
    59.62784609588432,
    61.26170176100199,
    62.9049908288765,
    64.55753862700632,
    66.21917683354901,
    67.88974313718154,
    69.56908092082364,
    71.257038967168,
    72.9534711841694,
    74.65823634883016,
    76.37119786778275,
    78.09222355331531,
    79.82118541361436,
    81.55795945611503,
    83.30242550295004,
    85.05446701758153,
    86.81397094178108,
    88.58082754219767,
    90.35493026581838,
    92.13617560368709,
    93.92446296229978,
    95.71969454214322,
    97.52177522288821,
    99.33061245478741,
    101.1461161558646,
    102.9681986145138,
    104.7967743971583,
    106.6317602606435,
    108.4730750690654,
    110.3206397147574,
    112.1743770431779,
    114.0342117814617,
    115.9000704704145,
    117.7718813997451,
    119.6495745463449,
    121.5330815154387,
    123.4223354844396,
    125.3172711493569,
    127.2178246736118,
    129.1239336391272,
    131.0355369995686,
    132.9525750356163,
    134.8749893121619,
    136.8027226373264,
    138.7357190232026,
    140.6739236482343,
    142.617282821146,
    144.5657439463449,
    146.5192554907206,
    148.477766951773,
    150.4412288270019,
    152.4095925844974,
    154.3828106346716,
    156.3608363030788,
    158.3436238042692,
    160.3311282166309,
    162.3233054581712,
    164.3201122631952,
    166.3215061598404,
    168.3274454484277,
    170.3378891805928,
    172.3527971391628,
    174.3721298187452,
    176.3958484069973,
    178.4239147665485,
    180.4562914175438,
    182.4929415207863,
    184.5338288614495,
    186.5789178333379,
    188.6281734236716,
    190.6815611983747,
    192.7390472878449,
    194.8005983731871,
    196.86618167289,
    198.9357649299295,
    201.0093163992815,
    203.0868048358281,
    205.1681994826412,
    207.2534700596299,
    209.3425867525368,
    211.435520202271,
    213.5322414945632,
    215.6327221499328,
    217.7369341139542,
    219.8448497478113,
    221.9564418191303,
    224.0716834930795,
    226.1905483237276,
    228.3130102456502,
    230.4390435657769,
    232.5686229554685,
    234.7017234428182,
    236.8383204051684,
    238.9783895618343,
    241.121906967029,
    243.2688490029827,
    245.4191923732478,
    247.5729140961868,
    249.7299914986334,
    251.8904022097232,
    254.0541241548883,
    256.2211355500095,
    258.3914148957209,
    260.5649409718632,
    262.7416928320802,
    264.9216497985528,
    267.1047914568685,
    269.2910976510198,
    271.4805484785288,
    273.6731242856937,
    275.8688056629533,
    278.0675734403662,
    280.2694086832001,
    282.4742926876305,
    284.6822069765408,
    286.893133295427,
    289.1070536083976,
    291.3239500942703,
    293.5438051427607,
    295.7666013507606,
    297.9923215187034,
    300.2209486470141,
    302.4524659326413,
    304.6868567656687,
    306.9241047260048,
    309.1641935801469,
    311.4071072780187,
    313.652829949879,
    315.9013459032995,
    318.1526396202093,
    320.4066957540055,
    322.6634991267262,
    324.9230347262869,
    327.1852877037753,
    329.4502433708053,
    331.7178871969285,
    333.9882048070999,
    336.2611819791985,
    338.5368046415996,
    340.815058870799,
    343.0959308890863,
    345.3794070622669,
    347.6654738974312,
    349.9541180407703,
    352.245326275435,
    354.5390855194408,
    356.835382823613,
    359.1342053695754,
  ];

  if (n < 201) {
    return lg[n - 1];
  }

  // For n>200, use the approx. formula given by numerical recipe
  let coef = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    1.208650973866179e-3,
    -5.395239384953e-6,
  ];
  let stp = 2.5066282746310005;
  let x = 0.5 * n;
  let y = x;
  let tmp = x + 5.5;
  tmp = (x + 0.5) * Math.log(tmp) - tmp;
  let ser = 1.000000000190015;
  for (let i = 0; i < 6; i++) {
    y = y + 1;
    ser = ser + coef[i] / y;
  }
  let gamln = tmp + Math.log((stp * ser) / x);
  return gamln;
}

const ksTest = (sampleData, alpha) => {
  // N elements in the sample data
  let n = sampleData.length;

  // Harcoded dictionary for the critic values
  let criticValues = {
    "0.001": [
      NaN,
      0.97764,
      0.92063,
      0.85046,
      0.78137,
      0.72479,
      0.6793,
      0.64098,
      0.06846,
      0.58042,
      0.55588,
      0.53422,
      0.5149,
      0.49753,
      0.48182,
      0.4675,
      0.4544,
      0.44234,
      0.43119,
      0.42085,
    ],
    "0.01": [
      0.995,
      0.9293,
      0.829,
      0.73421,
      0.66855,
      0.6166,
      0.5758,
      0.5418,
      0.5133,
      0.48895,
      0.4677,
      0.44905,
      0.43246,
      0.4176,
      0.4042,
      0.392,
      0.38085,
      0.37063,
      0.36116,
      0.3524,
    ],
    "0.02": [
      0.99,
      0.9,
      0.78456,
      0.68887,
      0.62718,
      0.57741,
      0.53844,
      0.50654,
      0.4796,
      0.45662,
      0.4367,
      0.41918,
      0.40362,
      0.3897,
      0.37713,
      0.36701,
      0.35528,
      0.34569,
      0.33685,
      0.32866,
    ],
    "0.05": [
      0.975,
      0.84189,
      0.7076,
      0.62394,
      0.56327,
      0.51926,
      0.48343,
      0.45427,
      0.43001,
      0.40925,
      0.39122,
      0.37543,
      0.36143,
      0.3489,
      0.3376,
      0.32733,
      0.31796,
      0.30936,
      0.30142,
      0.29407,
    ],
    "0.1": [
      0.95,
      0.77369,
      0.63604,
      0.56522,
      0.50945,
      0.46799,
      0.43607,
      0.40962,
      0.38746,
      0.36866,
      0.35242,
      0.33815,
      0.32548,
      0.31417,
      0.30397,
      0.29471,
      0.28627,
      0.27851,
      0.27135,
      0.26473,
    ],
    "0.15": [
      0.925,
      0.72614,
      0.59582,
      0.52476,
      0.47439,
      0.43526,
      0.40497,
      0.38062,
      0.36006,
      0.3425,
      0.32734,
      0.31408,
      0.30233,
      0.29181,
      0.28233,
      0.27372,
      0.26587,
      0.25867,
      0.25202,
      0.24587,
    ],
    "0.2": [
      0.9,
      0.68377,
      0.56481,
      0.49265,
      0.44697,
      0.41035,
      0.38145,
      0.35828,
      0.33907,
      0.32257,
      0.30826,
      0.29573,
      0.28466,
      0.27477,
      0.26585,
      0.25774,
      0.25035,
      0.24356,
      0.23731,
      0.23152,
    ],
  };

  let criticValuesOverflow = {
    "0.001": 1.94947,
    "0.01": 1.62762,
    "0.02": 1.51743,
    "0.05": 1.3581,
    "0.1": 1.22385,
    "0.15": 1.13795,
    "0.2": 1.07275,
  };

  // Critic value for the model based on the number of elements in the sample data and the alpha value

  let criticValue = criticValues[alpha][n - 1];
  if (n < 50) {
    criticValue = criticValues[alpha][n - 1];
  } else {
    criticValue = criticValuesOverflow[alpha] / Math.sqrt(n);
  }
  // Sort from lowest to highest
  sampleData.sort(function (a, b) {
    return a - b;
  });

  // Define all the arrays for the calculation table
  let avgPerPosition = Array();
  let dPlus = Array();
  let dMinus = Array();

  // Maximum values inside arrays for comparing the final max value with the critic value
  let dPlusMax;
  let dMinusMax;
  let finalMax;

  for (i = 0; i < n; i++) {
    if (isNaN(sampleData[i])) {
      alert("Data entry error");
      return false;
    }
    avgPerPosition.push((i + 1) / n);
    dPlus.push(avgPerPosition[i] - sampleData[i]);
    dMinus.push(sampleData[i] - i / n);
  }

  dPlusMax = Math.max(...dPlus);
  dMinusMax = Math.max(...dMinus);

  finalMax = Math.max(dPlusMax, dMinusMax);

  if (finalMax <= criticValue) {
    console.log(
      "The hypothesis is not rejected, since " +
        finalMax +
        " is less or equal than the critic value " +
        criticValue
    );
    return true;
  } else {
    console.log(
      "The hypothesis is rejected, since " +
        finalMax +
        " is higher than the critic value " +
        criticValue
    );
    return false;
  }
};

/* Example usage */
//console.log("Result:",ksTest([0.411,0.819,0.191,0.037,0.894,0.575,0.73,0.281,0.408,0.541,0.995,0.233,0.553,0.469,0.392,0.598,0.434,0.668,0.719,0.791,0.213,0.77,0.671,0.156,0.383,0.771,0.914,0.826,0.018,0.984,],0.05));

/* Combined Linear Congruential Method */
