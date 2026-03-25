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
    if (!name || isNaN(Number(value))) {
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
        updated = updated.replace(regex, constants[key].toString());
    }
    for (let key in variables) {
        let regex = new RegExp("\\b" + key + "\\b", "g");
        updated = updated.replace(regex, variables[key].toString());
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
    parsed = parsed.replace(/fact\(([^)]+)\)/g, (_match, num) => {
        return factorial(Number(num)).toString();
    });
    return parsed;
};
function addHistory(expr, res) {
    const li = document.createElement("li");
    li.textContent = `${expr} = ${res}`;
    li.onclick = () => {
        input.value = expr;
    };
    const del = document.createElement("button");
    del.textContent = "X";
    del.onclick = (e) => {
        e.stopPropagation();
        li.remove();
    };
    li.appendChild(del);
    historyList.appendChild(li);
}
const calculate = () => {
    try {
        let expr = input.value.trim();
        if (!expr)
            throw new Error("Empty expression");
        expr = replaceValues(expr);
        expr = parseExpression(expr);
        const result = Function(`return ${expr}`)();
        if (!isFinite(result))
            throw new Error("Math error");
        const formatted = result.toFixed(4);
        resultDisplay.textContent = formatted;
        addHistory(input.value, formatted);
    }
    catch (err) {
        resultDisplay.textContent = "Error: Invalid Expression";
    }
};
function updateVariableList() {
    const list = document.getElementById("varList");
    list.innerHTML = "";
    for (let key in variables) {
        const li = document.createElement("li");
        li.textContent = `${key} = ${variables[key]}`;
        const del = document.createElement("button");
        del.textContent = "X";
        del.onclick = (() => {
            const k = key;
            return () => {
                delete variables[k];
                updateVariableList();
            };
        })();
        li.appendChild(del);
        list.appendChild(li);
    }
}
const factorial = (n) => {
    if (n < 0)
        throw new Error("Invalid factorial");
    if (n === 0 || n === 1)
        return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};
