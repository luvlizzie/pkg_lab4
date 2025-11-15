const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = 20; 
const midX = Math.floor(canvas.width / 2);
const midY = Math.floor(canvas.height / 2);

let openCVReady = false;

function initOpenCV() {
    if (typeof cv === 'undefined') {
        setTimeout(initOpenCV, 100);
        return;
    }
    
    openCVReady = true;
    document.getElementById('opencvStatus').innerHTML = '✅ OpenCV.js загружен!';
    console.log("OpenCV готов к работе");
}

function gridToCanvas(x, y) {
    return { cx: midX + x * size, cy: midY - y * size };
}

function drawSquareOpenCV(mat, x, y, color) {
    const point = gridToCanvas(x, y);
    const halfSize = Math.floor(size / 2);
    const topLeft = new cv.Point(point.cx - halfSize + 1, point.cy - halfSize + 1);
    const bottomRight = new cv.Point(point.cx + halfSize - 1, point.cy + halfSize - 1);
    
    cv.rectangle(mat, topLeft, bottomRight, color, -1); 
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

function stepByStep(x1, y1, x2, y2) {
    if (openCVReady) {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const mat = cv.matFromImageData(imageData);
            
            const dx = x2 - x1, dy = y2 - y1;
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            const xinc = dx / steps, yinc = dy / steps;
            
            const pointColor = new cv.Scalar(139, 0, 0, 255); 
            
            let x = x1, y = y1;
            for (let i = 0; i <= steps; i++) {
                drawSquareOpenCV(mat, Math.round(x), Math.round(y), pointColor);
                x += xinc; 
                y += yinc;
            }
            
            cv.imshow(tempCanvas, mat);
            const resultData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.putImageData(resultData, 0, 0);
            
            mat.delete();
            return;
            
        } catch (error) {
            console.error("OpenCV error in stepByStep:", error);
        }
    }
    
    const dx = x2 - x1, dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xinc = dx / steps, yinc = dy / steps;
    let x = x1, y = y1;
    for (let i = 0; i <= steps; i++) {
        plot(Math.round(x), Math.round(y));
        x += xinc; 
        y += yinc;
    }
}

function dda(x1, y1, x2, y2) {
    if (openCVReady) {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const mat = cv.matFromImageData(imageData);
            
            const dx = x2 - x1, dy = y2 - y1;
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            const xinc = dx / steps, yinc = dy / steps;
            
            const pointColor = new cv.Scalar(0, 100, 0, 255); 
            
            let x = x1, y = y1;
            for (let i = 0; i <= steps; i++) {
                drawSquareOpenCV(mat, Math.round(x), Math.round(y), pointColor);
                x += xinc; 
                y += yinc;
            }
            
            cv.imshow(tempCanvas, mat);
            const resultData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.putImageData(resultData, 0, 0);
            
            mat.delete();
            return;
            
        } catch (error) {
            console.error("OpenCV error in dda:", error);
        }
    }
    
    const dx = x2 - x1, dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const xinc = dx / steps, yinc = dy / steps;
    let x = x1, y = y1;
    for (let i = 0; i <= steps; i++) {
        plot(Math.round(x), Math.round(y), "#006400");
        x += xinc; 
        y += yinc;
    }
}

function bresenhamLine(x1, y1, x2, y2) {
    if (openCVReady) {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const mat = cv.matFromImageData(imageData);
            
            let dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
            let sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
            let err = dx - dy;
            
            const pointColor = new cv.Scalar(0, 0, 139, 255); 
            
            while (true) {
                drawSquareOpenCV(mat, x1, y1, pointColor);
                
                if (x1 === x2 && y1 === y2) break;
                
                let e2 = 2 * err;
                if (e2 > -dy) { 
                    err -= dy; 
                    x1 += sx; 
                }
                if (e2 < dx) { 
                    err += dx; 
                    y1 += sy; 
                }
            }
            
            cv.imshow(tempCanvas, mat);
            const resultData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.putImageData(resultData, 0, 0);
            
            mat.delete();
            return;
            
        } catch (error) {
            console.error("OpenCV error in bresenhamLine:", error);
        }
    }
    
    let dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
        plot(x1, y1, "#00008B");
        if (x1 === x2 && y1 === y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x1 += sx; }
        if (e2 < dx) { err += dx; y1 += sy; }
    }
}

function bresenhamCircle(x0, y0, r) {
    if (openCVReady) {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const mat = cv.matFromImageData(imageData);
            
            const pointColor = new cv.Scalar(139, 69, 19, 255); 
            
            let x = 0;
            let y = r;
            let d = 3 - 2 * r; 
            
            drawSquareOpenCV(mat, x0, y0 + r, pointColor);
            drawSquareOpenCV(mat, x0, y0 - r, pointColor);
            drawSquareOpenCV(mat, x0 + r, y0, pointColor);
            drawSquareOpenCV(mat, x0 - r, y0, pointColor);
            
            while (x <= y) {
                x++;
                
                if (d > 0) {
                    y--;
                    d = d + 4 * (x - y) + 10;
                } else {
                    d = d + 4 * x + 6;
                }
                
                drawSquareOpenCV(mat, x0 + x, y0 + y, pointColor);
                drawSquareOpenCV(mat, x0 - x, y0 + y, pointColor);
                drawSquareOpenCV(mat, x0 + x, y0 - y, pointColor);
                drawSquareOpenCV(mat, x0 - x, y0 - y, pointColor);
                drawSquareOpenCV(mat, x0 + y, y0 + x, pointColor);
                drawSquareOpenCV(mat, x0 - y, y0 + x, pointColor);
                drawSquareOpenCV(mat, x0 + y, y0 - x, pointColor);
                drawSquareOpenCV(mat, x0 - y, y0 - x, pointColor);
            }
            
            cv.imshow(tempCanvas, mat);
            const resultData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.putImageData(resultData, 0, 0);
            
            mat.delete();
            return;
            
        } catch (error) {
            console.error("OpenCV error in bresenhamCircle:", error);
        }
    }
    
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;
    
    plot(x0, y0 + r, "#8B4513");
    plot(x0, y0 - r, "#8B4513");
    plot(x0 + r, y0, "#8B4513");
    plot(x0 - r, y0, "#8B4513");
    
    while (x <= y) {
        x++;
        
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        
        plot(x0 + x, y0 + y, "#8B4513");
        plot(x0 - x, y0 + y, "#8B4513");
        plot(x0 + x, y0 - y, "#8B4513");
        plot(x0 - x, y0 - y, "#8B4513");
        plot(x0 + y, y0 + x, "#8B4513");
        plot(x0 - y, y0 + x, "#8B4513");
        plot(x0 + y, y0 - x, "#8B4513");
        plot(x0 - y, y0 - x, "#8B4513");
    }
}

function wuLineOpenCV(x1, y1, x2, y2) {
    if (openCVReady) {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            drawGridOnCanvas(tempCtx);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const mat = cv.matFromImageData(imageData);
            
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
                
                const intensity1 = Math.round(255 * (1 - alpha));
                const intensity2 = Math.round(255 * alpha);
                
                const color1 = new cv.Scalar(139, 69, 19, intensity1);
                const color2 = new cv.Scalar(139, 69, 19, intensity2);
                
                if (steep) {
                    drawSquareOpenCV(mat, yFloor, x, color1);
                    drawSquareOpenCV(mat, yFloor + 1, x, color2);
                } else {
                    drawSquareOpenCV(mat, x, yFloor, color1);
                    drawSquareOpenCV(mat, x, yFloor + 1, color2);
                }
                y += gradient;
            }
            
            cv.imshow(tempCanvas, mat);
            const resultData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.putImageData(resultData, 0, 0);
            
            mat.delete();
            return;
            
        } catch (error) {
            console.error("OpenCV error in wuLineOpenCV:", error);
        }
    }
    
    wuLine(x1, y1, x2, y2);
}

function drawGridOnCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#ddd";
    
    for (let x = midX % size; x <= canvas.width; x += size) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }
    for (let y = midY % size; y <= canvas.height; y += size) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    context.strokeStyle = "#000";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(0, midY);
    context.lineTo(canvas.width, midY);
    context.moveTo(midX, 0);
    context.lineTo(midX, canvas.height);
    context.stroke();

    context.font = "12px Segoe UI";
    context.fillStyle = "#4B2E05";
    for (let i = -20; i <= 20; i++) {
        const { cx } = gridToCanvas(i, 0);
        context.fillText(i, cx - 5, midY + 15);
    }
    for (let j = -20; j <= 20; j++) {
        const { cy } = gridToCanvas(0, j);
        if (j !== 0) context.fillText(j, midX + 6, cy + 4);
    }
}

function draw() {
    clearCanvas();
    const algo = document.getElementById("algorithm").value;
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const x2 = parseFloat(document.getElementById("x2").value);
    const y2 = parseFloat(document.getElementById("y2").value);
    const radius = parseFloat(document.getElementById("radius").value) || 8;
    
    const runs = 5;
    const t0 = performance.now();
    
    for (let i = 0; i < runs; i++) {
        switch (algo) {
            case "step": stepByStep(x1, y1, x2, y2); break;
            case "dda": dda(x1, y1, x2, y2); break;
            case "bresenham": bresenhamLine(x1, y1, x2, y2); break;
            case "circle": bresenhamCircle(x1, y1, radius); break;
            case "wu": 
                if (openCVReady) {
                    wuLineOpenCV(x1, y1, x2, y2);
                } else {
                    wuLine(x1, y1, x2, y2);
                }
                break;
        }
    }
    
    const t1 = performance.now();
    const avg = (t1 - t0) / runs;
    
    clearCanvas();
    switch (algo) {
        case "step": stepByStep(x1, y1, x2, y2); break;
        case "dda": dda(x1, y1, x2, y2); break;
        case "bresenham": bresenhamLine(x1, y1, x2, y2); break;
        case "circle": bresenhamCircle(x1, y1, radius); break;
        case "wu": 
            if (openCVReady) {
                wuLineOpenCV(x1, y1, x2, y2);
            } else {
                wuLine(x1, y1, x2, y2);
            }
            break;
    }
    
    const mode = openCVReady ? " (OpenCV)" : " (Canvas API)";
    document.getElementById("time").innerText = 
        `Среднее время выполнения: ${avg.toFixed(5)} мс (из ${runs} повторов)${mode}`;
    updateDescription(algo);
}

function updateDescription(algo) {
    const desc = document.getElementById("desc");
    const texts = {
        step: `
            <h2>Пошаговый алгоритм</h2>
            <p><strong>Принцип работы:</strong> Самый простой алгоритм растеризации отрезка. Координаты X и Y изменяются равномерно с постоянным шагом.</p>
            <p><strong>Формулы:</strong></p>
            <ul>
                <li>steps = max(|Δx|, |Δy|)</li>
                <li>x<sub>inc</sub> = Δx / steps</li>
                <li>y<sub>inc</sub> = Δy / steps</li>
            </ul>
            <p><strong>Использование OpenCV:</strong> ${openCVReady ? "✅ Квадраты рисуются через cv.rectangle()" : "❌ OpenCV не доступен"}</p>
        `,
        
        dda: `
            <h2>Алгоритм ЦДА (Digital Differential Analyzer)</h2>
            <p><strong>Принцип работы:</strong> Улучшенная версия пошагового алгоритма. Использует дифференциальный анализ для вычисления приращений координат.</p>
            <p><strong>Формулы:</strong></p>
            <ul>
                <li>steps = max(|Δx|, |Δy|)</li>
                <li>x<sub>i+1</sub> = x<sub>i</sub> + Δx/steps</li>
                <li>y<sub>i+1</sub> = y<sub>i</sub> + Δy/steps</li>
            </ul>
            <p><strong>Использование OpenCV:</strong> ${openCVReady ? "✅ Квадраты рисуются через cv.rectangle()" : "❌ OpenCV не доступен"}</p>
        `,
        
        bresenham: `
            <h2>Алгоритм Брезенхема (отрезок)</h2>
            <p><strong>Принцип работы:</strong> Целочисленный алгоритм, использующий только сложение и вычитание. Основан на анализе ошибки для выбора следующего пикселя.</p>
            <p><strong>Основные шаги:</strong></p>
            <ol>
                <li>Вычисление Δx, Δy</li>
                <li>Инициализация ошибки: err = Δx - Δy</li>
                <li>На каждом шаге: e2 = 2 × err</li>
                <li>Если e2 > -Δy: err -= Δy, x += sx</li>
                <li>Если e2 < Δx: err += Δx, y += sy</li>
            </ol>
            <p><strong>Использование OpenCV:</strong> ${openCVReady ? "✅ Квадраты рисуются через cv.rectangle()" : "❌ OpenCV не доступен"}</p>
        `,
        
        circle: `
            <h2>Алгоритм Брезенхема (окружность)</h2>
            <p><strong>Принцип работы:</strong> Использует 8-точечную симметрию окружности для построения только 1/8 части, остальные точки вычисляются симметрично.</p>
            <p><strong>Ключевые особенности:</strong></p>
            <ul>
                <li>Начальная ошибка: d = 3 - 2r</li>
                <li>Целочисленная арифметика без умножения</li>
                <li>8-точечная симметрия для эффективности</li>
                <li>Построение от 0° до 45°, затем отражение</li>
            </ul>
            <p><strong>Формулы обновления ошибки:</strong></p>
            <ul>
                <li>Если d > 0: y--, d += 4(x - y) + 10</li>
                <li>Иначе: d += 4x + 6</li>
                <li>x++ на каждой итерации</li>
            </ul>
            <p><strong>Использование OpenCV:</strong> ${openCVReady ? "✅ Квадраты рисуются через cv.rectangle()" : "❌ OpenCV не доступен"}</p>
        `,
        
        wu: `
            <h2>Алгоритм Ву (Xiaolin Wu's algorithm)</h2>
            <p><strong>Принцип работы:</strong> Алгоритм с антиалиасингом, который рисует два пикселя с разной интенсивностью для сглаживания ступенек.</p>
            <p><strong>Основные концепции:</strong></p>
            <ul>
                <li>Интенсивность пикселя зависит от расстояния до идеальной линии</li>
                <li>Каждый шаг рисует 2 пикселя с прозрачностью</li>
                <li>Используется вещественная арифметика для точности</li>
                <li>Альфа-канал для плавных переходов</li>
            </ul>
            <p><strong>Использование OpenCV:</strong> ${openCVReady ? "✅ Квадраты рисуются через cv.rectangle() с альфа-каналом" : "❌ OpenCV не доступен, используется Canvas API"}</p>
            <p><strong>Формула прозрачности:</strong> alpha = дробная_часть(y)</p>
        `
    };
    desc.innerHTML = texts[algo] || "<h2>Выберите алгоритм</h2>";
}

function runPerformanceTest() {
    const algorithms = ['step', 'dda', 'bresenham', 'wu'];
    const testPoints = [[-10, -5, 10, 8]];
    const results = {};

    for (const algo of algorithms) {
        results[algo] = [];
        for (const [x1, y1, x2, y2] of testPoints) {
            const runs = 5;
            const t0 = performance.now();
            
            for (let i = 0; i < runs; i++) {
                switch (algo) {
                    case "step": stepByStep(x1, y1, x2, y2); break;
                    case "dda": dda(x1, y1, x2, y2); break;
                    case "bresenham": bresenhamLine(x1, y1, x2, y2); break;
                    case "wu": wuLine(x1, y1, x2, y2); break;
                }
            }
            
            const t1 = performance.now();
            results[algo].push((t1 - t0) / runs);
        }
    }

    let resultHTML = "<h3>Результаты теста производительности:</h3>";
    for (const algo of algorithms) {
        const avg = results[algo].reduce((a, b) => a + b) / results[algo].length;
        const algoNames = {
            'step': 'Пошаговый',
            'dda': 'ЦДА',
            'bresenham': 'Брезенхем',
            'wu': 'Ву (сглаживание)'
        };
        resultHTML += `<div class="performance-result">
            <span class="performance-algorithm">${algoNames[algo]}</span>
            <span class="performance-time">${avg.toFixed(5)} мс</span>
        </div>`;
    }
    
    document.getElementById('performance').innerHTML = resultHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    drawGrid();
    updateDescription("step");
    initOpenCV();
    
    document.getElementById('algorithm').addEventListener('change', function() {
        const radiusLabel = document.getElementById('radiusLabel');
        if (this.value === 'circle') {
            radiusLabel.style.display = 'inline';
        } else {
            radiusLabel.style.display = 'none';
        }
        updateDescription(this.value);
    });
});
