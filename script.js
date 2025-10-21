const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = 20; 
const midX = Math.floor(canvas.width / 2);
const midY = Math.floor(canvas.height / 2);

function gridToCanvas(x, y) {
  return { cx: midX + x * size, cy: midY - y * size };
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#ddd";
  for (let x = midX % size; x <= canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = midY % size; y <= canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(canvas.width, midY);
  ctx.moveTo(midX, 0);
  ctx.lineTo(midX, canvas.height);
  ctx.stroke();

  ctx.font = "12px Segoe UI";
  ctx.fillStyle = "#4B2E05";
  for (let i = -20; i <= 20; i++) {
    const { cx } = gridToCanvas(i, 0);
    ctx.fillText(i, cx - 5, midY + 15);
  }
  for (let j = -20; j <= 20; j++) {
    const { cy } = gridToCanvas(0, j);
    if (j !== 0) ctx.fillText(j, midX + 6, cy + 4);
  }
}

function plot(x, y, color = "#8B0000") {
  const { cx, cy } = gridToCanvas(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(cx - size / 2 + 1, cy - size / 2 + 1, size - 2, size - 2);
}

function clearCanvas() {
  drawGrid();
}

function bezierCurve(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + Math.sign(y2 - y1) * Math.abs(x2 - x1)/2; 
  let prevX = x1, prevY = y1;
  for (let t = 0; t <= 1; t += 0.02) {
    const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2;
    const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2;
    bresenhamLine(Math.round(prevX), Math.round(prevY), Math.round(x), Math.round(y));
    prevX = x; prevY = y;
  }
}

function wuLine(x1, y1, x2, y2) {
  const steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
  if (steep) { [x1, y1] = [y1, x1]; [x2, y2] = [y2, x2]; }
  if (x1 > x2) { [x1, x2] = [x2, x1]; [y1, y2] = [y2, y1]; }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const gradient = dx === 0 ? 1 : dy / dx;

  let y = y1;
  for (let x = x1; x <= x2; x++) {
    const yFloor = Math.floor(y);
    const alpha = y - yFloor;
    const c1 = `rgba(139,69,19,${1 - alpha})`; 
    const c2 = `rgba(139,69,19,${alpha})`;   

    if (steep) {
      plot(yFloor, x, c1);
      plot(yFloor + 1, x, c2);
    } else {
      plot(x, yFloor, c1);
      plot(x, yFloor + 1, c2);
    }
    y += gradient;
  }
}

function stepByStep(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xinc = dx / steps, yinc = dy / steps;
  let x = x1, y = y1;
  for (let i = 0; i <= steps; i++) {
    plot(Math.round(x), Math.round(y));
    x += xinc; y += yinc;
  }
}

function dda(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xinc = dx / steps, yinc = dy / steps;
  let x = x1, y = y1;
  for (let i = 0; i <= steps; i++) {
    plot(Math.round(x), Math.round(y));
    x += xinc; y += yinc;
  }
}

function bresenhamLine(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    plot(x1, y1);
    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}

function bresenhamCircle(x0, y0, r) {
  let x = 0, y = r, d = 3 - 2 * r;
  while (y >= x) {
    plot(x0 + x, y0 + y);
    plot(x0 - x, y0 + y);
    plot(x0 + x, y0 - y);
    plot(x0 - x, y0 - y);
    plot(x0 + y, y0 + x);
    plot(x0 - y, y0 + x);
    plot(x0 + y, y0 - x);
    plot(x0 - y, y0 - x);
    x++;
    if (d > 0) { y--; d = d + 4 * (x - y) + 10; }
    else d = d + 4 * x + 6;
  }
}

function draw() {
  clearCanvas();
  const algo = document.getElementById("algorithm").value;
  const x1 = parseFloat(document.getElementById("x1").value);
  const y1 = parseFloat(document.getElementById("y1").value);
  const x2 = parseFloat(document.getElementById("x2").value);
  const y2 = parseFloat(document.getElementById("y2").value);
  const runs = 50;
  const t0 = performance.now();
  for (let i = 0; i < runs; i++) {
    if (algo === "step") stepByStep(x1, y1, x2, y2);
    else if (algo === "dda") dda(x1, y1, x2, y2);
    else if (algo === "bresenham") bresenhamLine(x1, y1, x2, y2);
    else if (algo === "circle") bresenhamCircle(x1, y1, 8);
    else if (algo === "bezier") bezierCurve(x1, y1, x2, y2);
    else if (algo === "wu") wuLine(x1, y1, x2, y2);
  }
  const t1 = performance.now();
  const avg = (t1 - t0) / runs;
  clearCanvas();
  if (algo === "step") stepByStep(x1, y1, x2, y2);
  else if (algo === "dda") dda(x1, y1, x2, y2);
  else if (algo === "bresenham") bresenhamLine(x1, y1, x2, y2);
  else if (algo === "circle") bresenhamCircle(x1, y1, 8);
  else if (algo === "bezier") bezierCurve(x1, y1, x2, y2);
  else if (algo === "wu") wuLine(x1, y1, x2, y2);
  document.getElementById("time").innerText = 
    `Среднее время выполнения: ${avg.toFixed(5)} мс (из ${runs} повторов)`;
  updateDescription(algo);
}

function updateDescription(algo) {
  const desc = document.getElementById("desc");
  const texts = {
    step: "<h2>Пошаговый алгоритм</h2>Простейший способ растеризации. X и Y изменяются пошагово. Недостаток — ошибки накопления округлений.",
    dda: "<h2>ЦДА (Digital Differential Analyzer)</h2>Использует равномерное приращение координат. Прост в реализации, но требует округления на каждом шаге.",
    bresenham: "<h2>Брезенхем (отрезок)</h2>Целочисленный, быстрый и точный метод без делений, широко используемый в компьютерной графике.",
    circle: "<h2>Брезенхем (окружность)</h2>Использует симметрию и целочисленные вычисления, что делает его эффективным для построения окружностей.",
    bezier: "<h2>Кастла–Питвея (Bézier)</h2>Алгоритм построения кривой Безье второго порядка. Используется для плавных контуров и сглаженных траекторий.",
    wu: "<h2>Сглаженные линии (Ву)</h2>Учитывает частичное заполнение пикселей, что позволяет визуально устранить эффект ступенчатости линии."
  };
  desc.innerHTML = texts[algo];
}

drawGrid();
updateDescription("step");