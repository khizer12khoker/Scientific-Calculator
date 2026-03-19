const variables = {};
const constants = {
  pi: 3.1415,
  e: 2.7182
};

const input = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const historyList = document.getElementById("history");

const addToInput = (val) => {
  input.value += val;
};

const clearInput = () => {
  input.value = "";
  resultDisplay.textContent = "";
};

const addVariable = () => {
  const name = document.getElementById("varName").value.trim();
  const value = document.getElementById("varValue").value.trim();

  if (!name || isNaN(value)) {
    alert("Invalid variable");
    return;
  }

  if (constants[name]) {
    alert("Cannot use constant name");
    return;
  }

  variables[name] = parseFloat(value);

  updateVariableList(); 

  document.getElementById("varName").value = "";
  document.getElementById("varValue").value = "";
};

const replaceValues = (expr) => {
  let updated = expr;
  for (let key in constants) {
    let regex = new RegExp("\\b" + key + "\\b", "g");
    updated = updated.replace(regex, constants[key]);
  }
  for (let key in variables) {
    let regex = new RegExp("\\b" + key + "\\b", "g");
    updated = updated.replace(regex, variables[key]);
  }

  return updated;
};

const parseExpression = (expr) => {
  let parsed = expr;

  parsed = parsed.replace(/\^/g, "**");
  parsed = parsed.replace(/√\(/g, "Math.sqrt(");
  parsed = parsed.replace(/sin\(/g, "Math.sin(");
  parsed = parsed.replace(/cos\(/g, "Math.cos(");
  parsed = parsed.replace(/tan\(/g, "Math.tan(");
  parsed = parsed.replace(/fact\(([^)]+)\)/g, (match, num) => {
  return factorial(Number(num));
});

  return parsed;
};

function addHistory(expr, res) {
  var li = document.createElement("li");

  li.textContent = expr + " = " + res;
  li.onclick = function () {
    input.value = expr;
  };

  let del = document.createElement("button");
  del.textContent = "X";

  del.onclick = function (e) {
    e.stopPropagation();
    li.remove();
  };

  li.appendChild(del);
  historyList.appendChild(li);
}

const calculate = () => {
  try {
    let expr = input.value.trim();

    if (!expr) throw "Empty expression";

    expr = replaceValues(expr);
    expr = parseExpression(expr);

    let result = Function(`return ${expr}`)();

    if (!isFinite(result)) throw "Math error";

    result = Number(result).toFixed(4);

    resultDisplay.textContent = result;

    addHistory(input.value, result);

  } catch (err) {
    resultDisplay.textContent = "Error: Invalid Expression";
  }
};
function updateVariableList() {
  var list = document.getElementById("varList");
  list.innerHTML = "";
  for (var key in variables) {

    var li = document.createElement("li");
    li.textContent = key + " = " + variables[key];
    var del = document.createElement("button");
    del.textContent = "X";

    del.onclick = (function (k) {
      return function () {
        delete variables[k];
        updateVariableList();
      };
    })(key);

    li.appendChild(del);
    list.appendChild(li);
  }
}
const factorial = (n) => {
  if (n < 0) throw "Invalid factorial";
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};