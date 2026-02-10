import './index.css';

// Logic for the Stopwatch
let startTime: number = 0;
let elapsedTime: number = 0;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning: boolean = false;

const timerElement = document.getElementById('timer') as HTMLElement;
const toggleBtn = document.getElementById('toggle-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const closeBtn = document.getElementById('close-btn') as HTMLButtonElement;

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // Display 2 digits

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

function updateTimer() {
    const now = Date.now();
    const timeToDisplay = elapsedTime + (now - startTime);
    timerElement.textContent = formatTime(timeToDisplay);
}

function toggleTimer() {
    if (!isRunning) {
        // Start
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);
        isRunning = true;
        
        toggleBtn.textContent = "Stop";
        toggleBtn.classList.add('running');
        resetBtn.disabled = true;
    } else {
        // Stop
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        elapsedTime += Date.now() - startTime;
        isRunning = false;
        
        toggleBtn.textContent = "Start";
        toggleBtn.classList.remove('running');
        resetBtn.disabled = false;
    }
}

function resetTimer() {
    elapsedTime = 0;
    timerElement.textContent = "00:00:00";
    
    // Ensure we are in stopped state (though button should be disabled if running)
    isRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    toggleBtn.textContent = "Start";
    toggleBtn.classList.remove('running');
    
    resetBtn.disabled = true;
}

toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// IPC Close Button
closeBtn.addEventListener('click', () => {
    (window as any).electronAPI.closeWindow();
});
