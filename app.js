/* ==========================================================================
   ZENSPACE CORE JAVASCRIPT
   Implements Timer, Web Audio Synth, Task Matrix, Breath guide, Theme engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Subsystems
    initClock();
    initThemeEngine();
    initQuotes();
    initNotes();
    initBreathingSpace();
    initTasksMatrix();
    initPomodoroTimer();
});

/* ==========================================================================
   1. LIVE CLOCK SYSTEM
   ========================================================================== */
function initClock() {
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (!timeEl || !dateEl) return;

    function updateClock() {
        const now = new Date();
        
        // Time formatting
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12
        const formattedHours = String(hours).padStart(2, '0');
        
        timeEl.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

        // Date formatting
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. THEME ENGINE SYSTEM
   ========================================================================== */
function initThemeEngine() {
    const themeBtn = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    const themeOpts = document.querySelectorAll('.theme-opt');
    
    if (!themeBtn || !themeMenu) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('zs-theme') || 'cosmic';
    setTheme(savedTheme);

    // Toggle menu dropdown
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        themeMenu.classList.add('hidden');
    });

    // Select theme option
    themeOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const selectedTheme = opt.getAttribute('data-theme');
            setTheme(selectedTheme);
            themeMenu.classList.add('hidden');
        });
    });

    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('zs-theme', themeName);

        // Update button text
        const themeNamesMap = {
            'cosmic': 'Cosmic Dark',
            'forest': 'Forest Aura',
            'sunset': 'Sunset Glow',
            'aurora': 'Aurora Wave',
            'rose': 'Rose Quartz',
            'cyberpunk': 'Cyberpunk Glow'
        };

        const themeLabel = themeBtn.querySelector('span');
        if (themeLabel) {
            themeLabel.textContent = themeNamesMap[themeName] || (themeName.charAt(0).toUpperCase() + themeName.slice(1));
        }

        // Update active class in menu list
        themeOpts.forEach(opt => {
            if (opt.getAttribute('data-theme') === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   3. MINDFUL QUOTES SYSTEM
   ========================================================================== */
const ZEN_QUOTES = [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Focus is a muscle, and you build it just like any other muscle.", author: "Daniel Goleman" },
    { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
    { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
    { text: "Mindfulness isn't difficult, we just need to remember to do it.", author: "Sharon Salzberg" },
    { text: "You should sit in meditation for twenty minutes every day — unless you're too busy; then you should sit for an hour.", author: "Zen Proverb" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Muddy water is best cleared by leaving it alone.", author: "Alan Watts" },
    { text: "The energy of mindfulness is the main agent for self-transformation and self-healing.", author: "Thich Nhat Hanh" }
];

function initQuotes() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    const refreshBtn = document.getElementById('refresh-quote-btn');
    
    if (!textEl || !authorEl) return;

    function renderRandomQuote() {
        const index = Math.floor(Math.random() * ZEN_QUOTES.length);
        const quote = ZEN_QUOTES[index];
        
        // Dynamic fade effect using CSS transitions
        textEl.style.opacity = 0;
        authorEl.style.opacity = 0;
        
        setTimeout(() => {
            textEl.textContent = `"${quote.text}"`;
            authorEl.textContent = `— ${quote.author}`;
            textEl.style.opacity = 1;
            authorEl.style.opacity = 1;
        }, 250);
    }

    // Set transition styles on load
    textEl.style.transition = 'opacity 0.25s ease';
    authorEl.style.transition = 'opacity 0.25s ease';

    renderRandomQuote();
    if (refreshBtn) {
        refreshBtn.addEventListener('click', renderRandomQuote);
    }
}

/* ==========================================================================
   4. ZEN NOTES SYSTEM (AUTOSAVE & WORD COUNTER)
   ========================================================================== */
function initNotes() {
    const notebook = document.getElementById('zen-notebook');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const clearBtn = document.getElementById('clear-notes-btn');

    if (!notebook) return;

    // Load initial notes
    const savedNotes = localStorage.getItem('zs-notes') || '';
    notebook.value = savedNotes;
    updateCounters(savedNotes);

    // Save timer variable for debouncing
    let saveTimeout;

    notebook.addEventListener('input', (e) => {
        const text = e.target.value;
        updateCounters(text);

        // Debounce autosave to avoid disk clogging
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('zs-notes', text);
        }, 500);
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear your note space?")) {
                notebook.value = '';
                updateCounters('');
                localStorage.setItem('zs-notes', '');
            }
        });
    }

    function updateCounters(text) {
        if (!charCountEl || !wordCountEl) return;
        
        charCountEl.textContent = text.length;
        
        const cleanText = text.trim();
        const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
        wordCountEl.textContent = words;
    }
}

/* ==========================================================================
   5. WEB AUDIO SYNTHESIZER SYSTEM (drone & timer bell)
   ========================================================================== */
let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneGain = null;
let droneFilter = null;
let isDronePlaying = false;

function playZenBell() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        // Rich harmonic gong using frequencies 330, 440, 550, 660
        const frequencies = [330, 440, 550, 660];
        
        frequencies.forEach((f, idx) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            
            // Envelope details
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.04);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 4);
        });
    } catch (e) {
        console.error("Audio Synthesis error: ", e);
    }
}

function startFocusDrone() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // Binaural beat oscillators: 120Hz & 120.4Hz
        droneOsc1 = audioCtx.createOscillator();
        droneOsc2 = audioCtx.createOscillator();
        
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(120, now);
        
        droneOsc2.type = 'sine';
        droneOsc2.frequency.setValueAtTime(120.4, now);
        
        // Lowpass filter to make it deeply ambient and warm
        droneFilter = audioCtx.createBiquadFilter();
        droneFilter.type = 'lowpass';
        droneFilter.frequency.setValueAtTime(140, now);
        
        droneGain = audioCtx.createGain();
        droneGain.gain.setValueAtTime(0, now);
        droneGain.gain.linearRampToValueAtTime(0.06, now + 2.0); // smooth fade in

        // Connections
        droneOsc1.connect(droneFilter);
        droneOsc2.connect(droneFilter);
        droneFilter.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        droneOsc1.start(now);
        droneOsc2.start(now);
        
        isDronePlaying = true;
    } catch(e) {
        console.error("Failed to start Ambient Drone:", e);
    }
}

function stopFocusDrone() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    if (droneGain) {
        // Fade out before stopping to avoid audio click pop
        droneGain.gain.setValueAtTime(droneGain.gain.value, now);
        droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
    }

    setTimeout(() => {
        if (droneOsc1) {
            droneOsc1.stop();
            droneOsc1.disconnect();
            droneOsc1 = null;
        }
        if (droneOsc2) {
            droneOsc2.stop();
            droneOsc2.disconnect();
            droneOsc2 = null;
        }
        if (droneGain) {
            droneGain.disconnect();
            droneGain = null;
        }
        isDronePlaying = false;
    }, 1100);
}

/* ==========================================================================
   6. BREATHING GUIDE SYSTEM
   ========================================================================== */
function initBreathingSpace() {
    const toggleBtn = document.getElementById('breath-toggle-btn');
    const circle = document.getElementById('breathing-circle');
    const textEl = document.getElementById('breathing-text');
    
    if (!toggleBtn || !circle || !textEl) return;

    let breathInterval = null;
    let isBreathingActive = false;

    // Breathing phase pattern: Inhale (4s), Hold (4s), Exhale (4s)
    const phases = [
        { text: 'Inhale', class: 'breathing-inhale', duration: 4000 },
        { text: 'Hold', class: 'breathing-hold', duration: 4000 },
        { text: 'Exhale', class: 'breathing-exhale', duration: 4000 }
    ];
    let currentPhaseIdx = 0;

    toggleBtn.addEventListener('click', () => {
        if (isBreathingActive) {
            stopBreathing();
        } else {
            startBreathing();
        }
    });

    function startBreathing() {
        isBreathingActive = true;
        toggleBtn.textContent = 'Pause Breathing';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
        currentPhaseIdx = 0;
        runBreathCycle();
    }

    function runBreathCycle() {
        if (!isBreathingActive) return;

        const phase = phases[currentPhaseIdx];
        textEl.textContent = phase.text;
        
        // Remove prior classes, assign current phase class
        circle.className = 'breath-circle'; 
        circle.classList.add(phase.class);

        breathInterval = setTimeout(() => {
            currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
            runBreathCycle();
        }, phase.duration);
    }

    function stopBreathing() {
        isBreathingActive = false;
        clearTimeout(breathInterval);
        
        // Reset styles
        circle.className = 'breath-circle';
        textEl.textContent = 'Start';
        toggleBtn.textContent = 'Begin Breathwork';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
    }
}

/* ==========================================================================
   7. FLOW TASKS MATRIX SYSTEM (Eisenhower CRUD & Stats)
   ========================================================================== */
function initTasksMatrix() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskQuadrant = document.getElementById('task-quadrant');
    const statsDone = document.getElementById('task-completed-count');
    const statsTotal = document.getElementById('task-total-count');

    if (!taskForm || !taskInput || !taskQuadrant) return;

    let tasks = [];

    // Load tasks from LocalStorage
    try {
        tasks = JSON.parse(localStorage.getItem('zs-tasks')) || [];
    } catch(e) {
        tasks = [];
    }

    // Initial render
    renderTasks();

    // Form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            quadrant: taskQuadrant.value
        };

        tasks.push(newTask);
        saveAndRender();
        
        // Reset input
        taskInput.value = '';
        taskInput.focus();
    });

    function renderTasks() {
        // Clear all Lists in DOM
        const lists = {
            q1: document.getElementById('list-q1'),
            q2: document.getElementById('list-q2'),
            q3: document.getElementById('list-q3'),
            q4: document.getElementById('list-q4')
        };

        // Reset DOM lists
        Object.values(lists).forEach(list => {
            if (list) list.innerHTML = '';
        });

        let completedCount = 0;

        tasks.forEach(task => {
            const listEl = lists[task.quadrant];
            if (!listEl) return;

            if (task.completed) completedCount++;

            // Create Item Element
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            li.innerHTML = `
                <div class="task-checkbox-wrapper">
                    <span class="task-checkbox" aria-label="Mark completed"></span>
                </div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="btn-delete-task" aria-label="Delete task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            `;

            // Complete Trigger
            li.querySelector('.task-checkbox-wrapper').addEventListener('click', () => {
                toggleTaskComplete(task.id);
            });

            // Delete Trigger
            li.querySelector('.btn-delete-task').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            listEl.appendChild(li);
        });

        // Update global matrix counts
        if (statsDone) statsDone.textContent = completedCount;
        if (statsTotal) statsTotal.textContent = tasks.length;
    }

    function toggleTaskComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('zs-tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

/* ==========================================================================
   8. POMODORO TIMER SYSTEM
   ========================================================================== */
function initPomodoroTimer() {
    const timerProgress = document.getElementById('timer-progress');
    const timerCountdown = document.getElementById('timer-countdown');
    const timerLabel = document.getElementById('timer-label');
    const toggleBtn = document.getElementById('timer-toggle-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const soundToggle = document.getElementById('sound-toggle-btn');
    const modeTabs = document.querySelectorAll('.mode-tab');

    if (!timerCountdown || !toggleBtn) return;

    let timeTotal = 25 * 60; // default 25 mins
    let timeRemaining = timeTotal;
    let timerInterval = null;
    let isRunning = false;
    let currentModeName = 'Focus Mode';

    // SVG Circumference helper
    function getCircumference() {
        if (!timerProgress) return 596.9; // fallback
        const r = timerProgress.r.baseVal.value;
        return 2 * Math.PI * r;
    }

    // Set initial dash-array
    updateProgressRing();

    // Modes switcher clicks
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (isRunning) {
                if (!confirm("A focus session is active. Switch modes and discard current progress?")) {
                    return;
                }
            }
            
            // Toggle active classes
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Configure durations
            const minutes = parseInt(tab.getAttribute('data-time'), 10);
            timeTotal = minutes * 60;
            timeRemaining = timeTotal;

            // Configure Label texts
            if (tab.id === 'mode-focus') {
                currentModeName = 'Focus Mode';
                timerLabel.textContent = 'Focus Mode';
            } else if (tab.id === 'mode-short') {
                currentModeName = 'Short Break';
                timerLabel.textContent = 'Short Break';
            } else {
                currentModeName = 'Long Break';
                timerLabel.textContent = 'Long Break';
            }

            pauseTimer();
            updateTimerDisplay();
            updateProgressRing();
        });
    });

    // Control buttons triggers
    toggleBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener('click', () => {
        pauseTimer();
        timeRemaining = timeTotal;
        updateTimerDisplay();
        updateProgressRing();
    });

    // Ambient Synth Audio Toggle
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const isSoundOn = soundToggle.getAttribute('aria-pressed') === 'true';
            
            if (isSoundOn) {
                // Turn OFF sound
                soundToggle.setAttribute('aria-pressed', 'false');
                soundToggle.classList.remove('active');
                soundToggle.querySelector('span').textContent = 'Off';
                stopFocusDrone();
            } else {
                // Turn ON sound
                soundToggle.setAttribute('aria-pressed', 'true');
                soundToggle.classList.add('active');
                soundToggle.querySelector('span').textContent = 'On';
                if (isRunning && currentModeName === 'Focus Mode') {
                    startFocusDrone();
                }
            }
        });
    }

    function startTimer() {
        isRunning = true;
        
        // Update control button UI
        toggleBtn.querySelector('span').textContent = 'Pause';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
        toggleBtn.querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';

        // Play ambient drone if toggled and in Focus mode
        if (soundToggle && soundToggle.getAttribute('aria-pressed') === 'true' && currentModeName === 'Focus Mode') {
            startFocusDrone();
        }

        timerInterval = setInterval(() => {
            timeRemaining--;
            
            if (timeRemaining < 0) {
                // Timer finished!
                clearInterval(timerInterval);
                playZenBell();
                
                // Alert visual message
                alert(`${currentModeName} has concluded.`);
                
                // Stop focus ambient drone
                stopFocusDrone();
                
                // Reset states
                isRunning = false;
                timeRemaining = timeTotal;
                pauseTimer();
            }
            
            updateTimerDisplay();
            updateProgressRing();
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        
        // Update control button UI
        toggleBtn.querySelector('span').textContent = 'Start';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
        toggleBtn.querySelector('svg').innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';

        // Pause ambient drone
        stopFocusDrone();
    }

    function updateTimerDisplay() {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        // Dynamic title bar tracking progress
        document.title = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} | ZenSpace`;
    }

    function updateProgressRing() {
        if (!timerProgress) return;
        
        const circumference = getCircumference();
        timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
        
        const progress = timeRemaining / timeTotal;
        const offset = circumference - (progress * circumference);
        timerProgress.style.strokeDashoffset = offset;
    }

    // Listen to resize events to update the circular SVG progress dash boundaries
    window.addEventListener('resize', () => {
        updateProgressRing();
    });
}
