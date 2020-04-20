function set(method) {
  let randomTable = document.getElementById("random");
  randomTable.innerHTML = "";

  let centrosCuadrados = document.getElementById("centrosCuadrados");
  let congruencial = document.getElementById("congruencial");
  let congruencialMixto = document.getElementById("congruencialMixto");
  let multiplicativo = document.getElementById("multiplicativo");
  let congruencialLineal = document.getElementById("congruencialLineal");

  let centrosCuadradosForm = document.getElementById("centrosCuadradosForm");
  let congruencialForm = document.getElementById("congruencialForm");
  let congruencialMixtoForm = document.getElementById("congruencialMixtoForm");
  let multiplicativoForm = document.getElementById("multiplicativoForm");
  let congruencialLinealForm = document.getElementById(
    "congruencialLinealForm"
  );

  centrosCuadrados.classList.remove("active");
  congruencial.classList.remove("active");
  congruencialMixto.classList.remove("active");
  multiplicativo.classList.remove("active");
  congruencialLineal.classList.remove("active");

  centrosCuadradosForm.classList.remove("active");
  congruencialForm.classList.remove("active");
  congruencialMixtoForm.classList.remove("active");
  multiplicativoForm.classList.remove("active");
  congruencialLinealForm.classList.remove("active");
  switch (method) {
    case "centrosCuadrados":
      centrosCuadradosForm.classList.add("active");
      centrosCuadrados.classList.add("active");
      break;
    case "congruencial":
      congruencialForm.classList.add("active");
      congruencial.classList.add("active");
      break;
    case "congruencialMixto":
      congruencialMixtoForm.classList.add("active");
      congruencialMixto.classList.add("active");
      break;
    case "multiplicativo":
      multiplicativoForm.classList.add("active");
      multiplicativo.classList.add("active");
      break;
    case "congruencialLineal":
      congruencialLinealForm.classList.add("active");
      congruencialLineal.classList.add("active");
      break;
  }
}

function generateRandomds(method) {
  let form;
  let randomTable = document.getElementById("random");
  randomNumbers = [];
  randomTable.innerHTML = "";
  switch (method) {
    case "centrosCuadrados":
      form = document.getElementById("centrosCuadradosForm");
      x0 = parseInt(form.elements.namedItem("x0").value);
      n = parseInt(form.elements.namedItem("numbers").value);
      randomNumbers = middleSquareMethod(x0, n);
      break;
    case "congruencial":
      form = document.getElementById("congruencialForm");
      x0 = parseInt(form.elements.namedItem("x0").value);
      a = parseInt(form.elements.namedItem("a").value);
      c = parseInt(form.elements.namedItem("c").value);
      m = parseInt(form.elements.namedItem("m").value);
      n = parseInt(form.elements.namedItem("numbers").value);

      randomNumbers = linearCongruentialMethod(x0, a, c, m, n);
      alpha = form.elements.namedItem("alpha").value;
      form.elements.namedItem("ks").classList.remove("correct");
      form.elements.namedItem("ks").classList.remove("incorrect");
      form.elements.namedItem("chi").classList.remove("correct");
      form.elements.namedItem("chi").classList.remove("incorrect");


      if (ksTest(randomNumbers, alpha)) {
        form.elements.namedItem("ks").classList.add("correct");
      } else {
        form.elements.namedItem("ks").classList.add("incorrect");
      }

      if (chiSquareTest(randomNumbers, alpha)) {
        form.elements.namedItem("chi").classList.add("correct");
      } else {
        form.elements.namedItem("chi").classList.add("incorrect");
      }
      break;
    case "congruencialMixto":
      form = document.getElementById("congruencialMixtoForm");
      x0 = parseInt(form.elements.namedItem("x0").value);
      a = parseInt(form.elements.namedItem("a").value);
      c = parseInt(form.elements.namedItem("c").value);
      m = parseInt(form.elements.namedItem("m").value);
      n = parseInt(form.elements.namedItem("numbers").value);
      randomNumbers = mixedLinearCongruentialMethod(x0, a, c, m, n);
      alpha = form.elements.namedItem("alpha").value;
      if (randomNumbers == -1) {
        randomNumbers = [];
        alert("No cumple HullDobell");
      } else {
        if (ksTest(randomNumbers, alpha)) {
          form.elements.namedItem("ks").classList.add("correct");
        } else {
          form.elements.namedItem("ks").classList.add("incorrect");
        }

        if (chiSquareTest(randomNumbers, alpha)) {
          form.elements.namedItem("chi").classList.add("correct");
        } else {
          form.elements.namedItem("chi").classList.add("incorrect");
        }
      }

      break;
    case "multiplicativo":
      form = document.getElementById("multiplicativoForm");
      x0 = parseInt(form.elements.namedItem("x0").value);
      a = parseInt(form.elements.namedItem("a").value);
      m = parseInt(form.elements.namedItem("m").value);
      n = parseInt(form.elements.namedItem("numbers").value);
      alpha = form.elements.namedItem("alpha").value;
      randomNumbers = multiplicativeCongruentialMethod(x0, a, m, n);
      if (ksTest(randomNumbers, alpha)) {
        form.elements.namedItem("ks").classList.add("correct");
      } else {
        form.elements.namedItem("ks").classList.add("incorrect");
      }

      if (chiSquareTest(randomNumbers, alpha)) {
        form.elements.namedItem("chi").classList.add("correct");
      } else {
        form.elements.namedItem("chi").classList.add("incorrect");
      }

      break;
    case "congruencialLineal":
      form = document.getElementById("congruencialLinealForm");
      x0 = parseInt(form.elements.namedItem("x0").value);
      a = parseInt(form.elements.namedItem("a").value);
      c = parseInt(form.elements.namedItem("c").value);
      m = parseInt(form.elements.namedItem("m").value);
      n = parseInt(form.elements.namedItem("numbers").value);

      x02 = parseInt(form.elements.namedItem("x02").value);
      a2 = parseInt(form.elements.namedItem("a2").value);
      c2 = parseInt(form.elements.namedItem("c2").value);
      m2 = parseInt(form.elements.namedItem("m2").value);
      n2 = parseInt(form.elements.namedItem("numbers2").value);

      const g = [
        { parameters: { seed: x0, a: a, c: c, m: m } },
        { parameters: { seed: x02, a: a2, c: c2, m: m2 } },
      ];
      randomNumbers = combinedLinearCongruentialMethod(g, n, n2);
      break;
  }
  //console.log(randomNumbers);
  let htmlString = "";
  for (let n of randomNumbers) {
    htmlString = `${htmlString}<span>${n.toFixed(5)}</span>`;
  }
  randomTable.innerHTML = htmlString;

  return false;
}
