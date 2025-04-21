// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Function to create interactive function demos
    function createFunctionDemo(containerId, func, xRange = [-10, 10], yRange = [-10, 10], gridStep = 1) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = 300;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#1e1e1e'; // Dark background
        ctx.fillRect(0, 0, width, height);

        // Set up coordinate system
        const scaleX = width / (xRange[1] - xRange[0]);
        const scaleY = height / (yRange[1] - yRange[0]);
        const originX = -xRange[0] * scaleX;
        const originY = height + yRange[0] * scaleY;

        // Draw grid
        ctx.strokeStyle = '#333'; // Darker grid lines
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x += gridStep) {
            ctx.beginPath();
            const px = originX + x * scaleX;
            ctx.moveTo(px, 0);
            ctx.lineTo(px, height);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let y = Math.ceil(yRange[0]); y <= Math.floor(yRange[1]); y += gridStep) {
            ctx.beginPath();
            const py = originY - y * scaleY;
            ctx.moveTo(0, py);
            ctx.lineTo(width, py);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#666'; // Lighter axes
        ctx.lineWidth = 2;

        // x-axis
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        ctx.stroke();

        // y-axis
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        ctx.stroke();

        // Draw function
        ctx.strokeStyle = '#3498db'; // Keep the bright blue for the function
        ctx.lineWidth = 2;
        ctx.beginPath();

        let isFirstPoint = true;
        for (let px = 0; px < width; px++) {
            const x = (px - originX) / scaleX;
            const y = func(x);
            const py = originY - y * scaleY;

            if (isFirstPoint) {
                ctx.moveTo(px, py);
                isFirstPoint = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    }

    // Example functions for demos
    const demoFunctions = {
        linear: {
            func: x => 2 * x + 1,
            name: 'Lineare: f(x) = 2x + 1',
            range: [-5, 5]
        },
        quadratic: {
            func: x => x * x,
            name: 'Quadratica: f(x) = x²',
            range: [-4, 4]
        },
        absolute: {
            func: x => Math.abs(x),
            name: 'Modulo: f(x) = |x|',
            range: [-4, 4]
        },
        cubic: {
            func: x => x * x * x,
            name: 'Cubica: f(x) = x³',
            range: [-3, 3]
        },
        inverse: {
            func: x => 1/x,
            name: 'Inversa: f(x) = 1/x',
            range: [-5, 5]
        },
        even: {
            func: x => x * x - 2,
            name: 'Pari: f(x) = x² - 2',
            range: [-3, 3]
        },
        odd: {
            func: x => x * x * x - x,
            name: 'Dispari: f(x) = x³ - x',
            range: [-2, 2]
        }
    };

    // Create function property demos
    const propertyDemos = document.getElementById('function-properties-demo');
    if (propertyDemos) {
        const demoContainer = document.createElement('div');
        demoContainer.className = 'demo-controls';
        
        // Add function selector
        const functionSelect = document.createElement('select');
        Object.keys(demoFunctions).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = demoFunctions[key].name;
            functionSelect.appendChild(option);
        });

        // Add description
        const description = document.createElement('p');
        description.className = 'demo-description';
        description.style.marginTop = '1rem';
        description.style.fontStyle = 'italic';

        demoContainer.appendChild(functionSelect);
        propertyDemos.appendChild(demoContainer);
        propertyDemos.appendChild(description);

        // Create initial graph
        const initialFunc = demoFunctions[functionSelect.value];
        createFunctionDemo('function-properties-demo', initialFunc.func, 
            [-5, 5], [-5, 5]);
        updateDescription(functionSelect.value);

        // Update graph when function changes
        functionSelect.addEventListener('change', () => {
            const selectedFunc = demoFunctions[functionSelect.value];
            propertyDemos.querySelector('canvas')?.remove();
            createFunctionDemo('function-properties-demo', selectedFunc.func,
                [-5, 5], [-5, 5]);
            updateDescription(functionSelect.value);
        });

        // Function to update description
        function updateDescription(funcKey) {
            const func = demoFunctions[funcKey];
            let desc = '';
            switch(funcKey) {
                case 'linear':
                    desc = 'Funzione lineare: è sia iniettiva che suriettiva, quindi biiettiva.';
                    break;
                case 'quadratic':
                    desc = 'Funzione quadratica: non è iniettiva (più x hanno la stessa y), ma è suriettiva su [0,+∞).';
                    break;
                case 'absolute':
                    desc = 'Funzione modulo: non è iniettiva, è suriettiva su [0,+∞). È una funzione pari.';
                    break;
                case 'cubic':
                    desc = 'Funzione cubica: è iniettiva e suriettiva, quindi biiettiva. È una funzione dispari.';
                    break;
                case 'inverse':
                    desc = 'Funzione inversa: è iniettiva e suriettiva sul suo dominio (x ≠ 0).';
                    break;
                case 'even':
                    desc = 'Funzione pari: simmetrica rispetto all\'asse y, f(-x) = f(x).';
                    break;
                case 'odd':
                    desc = 'Funzione dispari: simmetrica rispetto all\'origine, f(-x) = -f(x).';
                    break;
            }
            description.textContent = desc;
        }
    }

    // Add MathJax for better math formula rendering
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    document.head.appendChild(script);

    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    document.head.appendChild(mathJaxScript);

    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add animation to formulas when they come into view
    const formulas = document.querySelectorAll('.formula');
    function handleFormulaAnimation() {
        formulas.forEach(formula => {
            if (isInViewport(formula) && !formula.classList.contains('visible')) {
                formula.classList.add('visible');
            }
        });
    }

    // Listen for scroll events to trigger animations
    window.addEventListener('scroll', handleFormulaAnimation);
    handleFormulaAnimation(); // Check initial state
});

// Add CSS animation for formulas
const style = document.createElement('style');
style.textContent = `
    .formula {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .formula.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .demo-controls {
        margin-bottom: 1rem;
    }

    .demo-controls select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 100%;
        max-width: 400px;
    }
`;
document.head.appendChild(style); 