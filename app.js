/* ==========================================================================
   ZENSPACE UPGRADED JAVASCRIPT
   Aesthetic visual glows, white-noise synthesizer, drag-drop, mood tracker
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Subsystems
    initCardGlows();
    initClock();
    initThemeEngine();
    initQuotes();
    initNotes();
    initBreathingSpace();
    initTasksMatrix();
    initPomodoroTimer();
    initMoodTracker();
});

/* ==========================================================================
   0. VISUAL INTERACTIVE CARD GLOWS
   ========================================================================== */
function initCardGlows() {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   1. LIVE CLOCK SYSTEM
   ========================================================================== */
function initClock() {
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (!timeEl || !dateEl) return;

    function updateClock() {
        const now = new Date();
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        
        timeEl.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

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

    const savedTheme = localStorage.getItem('zs-theme') || 'cosmic';
    setTheme(savedTheme);

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        themeMenu.classList.add('hidden');
    });

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
        
        textEl.style.opacity = 0;
        authorEl.style.opacity = 0;
        
        setTimeout(() => {
            textEl.textContent = `"${quote.text}"`;
            authorEl.textContent = `— ${quote.author}`;
            textEl.style.opacity = 1;
            authorEl.style.opacity = 1;
        }, 250);
    }

    textEl.style.transition = 'opacity 0.25s ease';
    authorEl.style.transition = 'opacity 0.25s ease';

    renderRandomQuote();
    if (refreshBtn) {
        refreshBtn.addEventListener('click', renderRandomQuote);
    }
}

/* ==========================================================================
   4. ZEN NOTES SYSTEM (AUTOSAVE, COUNTERS & LOG EXPORT)
   ========================================================================== */
function initNotes() {
    const notebook = document.getElementById('zen-notebook');
    const charCountEl = document.getElementById('char-count');
    const wordCountEl = document.getElementById('word-count');
    const clearBtn = document.getElementById('clear-notes-btn');
    const exportBtn = document.getElementById('export-notes-btn');

    if (!notebook) return;

    const savedNotes = localStorage.getItem('zs-notes') || '';
    notebook.value = savedNotes;
    updateCounters(savedNotes);

    let saveTimeout;

    notebook.addEventListener('input', (e) => {
        const text = e.target.value;
        updateCounters(text);

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

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const noteText = notebook.value.trim();
            if (noteText === '') {
                alert("Notes are empty. Write something before exporting.");
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const blob = new Blob([
                `# ZenSpace Notes - ${today}\n\n`,
                `Energy Level Today: ${getCurrentMoodText()}\n\n`,
                `---\n\n`,
                noteText
            ], { type: 'text/markdown;charset=utf-8' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zenspace_thoughts_${today.replace(/-/g, '_')}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    function updateCounters(text) {
        if (!charCountEl || !wordCountEl) return;
        charCountEl.textContent = text.length;
        const cleanText = text.trim();
        const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
        wordCountEl.textContent = words;
    }

    function getCurrentMoodText() {
        const activeMoodBtn = document.querySelector('.mood-emoji-btn.active');
        return activeMoodBtn ? activeMoodBtn.getAttribute('data-mood').toUpperCase() : 'NOT RECORDED';
    }
}

/* ==========================================================================
   5. WEB AUDIO SYNTHESIZER SYSTEM (Gong, Noise Generator & Volume Control)
   ========================================================================== */
let audioCtx = null;
let noiseNode = null;
let noiseGain = null;
let noiseFilter = null;
let ambientVolume = 0.5; // default 50%

let breathingOsc = null;
let breathingFilter = null;
let breathingGain = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Resonant bell gong
function playZenBell() {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        const frequencies = [330, 440, 550, 660];
        
        frequencies.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime((0.15 / (idx + 1)) * ambientVolume, now + 0.04);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 4.5);
        });
    } catch (e) {
        console.error("Audio Bell Synthesis error: ", e);
    }
}

// Low-pass filtered White/Pink Noise focus block
function startFocusNoise() {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Fill buffer with random values for white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Warm ambient low-pass filter
        noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(150, now); // low cozy drone
        noiseFilter.Q.setValueAtTime(1.5, now);

        noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.12 * ambientVolume, now + 1.5); // Fade in

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noiseNode.start(now);
    } catch (e) {
        console.error("Noise drone synthesis failed: ", e);
    }
}

function stopFocusNoise() {
    if (!audioCtx || !noiseNode) return;
    const now = audioCtx.currentTime;
    try {
        noiseGain.gain.setValueAtTime(noiseGain.gain.value, now);
        noiseGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        
        const currentNoiseNode = noiseNode;
        const currentGainNode = noiseGain;
        noiseNode = null;
        noiseGain = null;

        setTimeout(() => {
            try {
                currentNoiseNode.stop();
                currentNoiseNode.disconnect();
                currentGainNode.disconnect();
            } catch(err){}
        }, 1100);
    } catch(err){}
}

function updateAmbientVolume(val) {
    ambientVolume = parseFloat(val) / 100;
    const ctx = getAudioContext();
    if (noiseGain) {
        const now = ctx.currentTime;
        noiseGain.gain.setValueAtTime(noiseGain.gain.value, now);
        noiseGain.gain.linearRampToValueAtTime(0.12 * ambientVolume, now + 0.1);
    }
}

// Breathing Swell Synthesizer (Filter sweep synchronizer)
function startBreathingAudio() {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        breathingOsc = ctx.createOscillator();
        breathingOsc.type = 'triangle'; // warmer than sine, richer than saw
        breathingOsc.frequency.setValueAtTime(80, now); // low soothing hum

        breathingFilter = ctx.createBiquadFilter();
        breathingFilter.type = 'lowpass';
        breathingFilter.frequency.setValueAtTime(120, now);
        breathingFilter.Q.setValueAtTime(3.0, now); // slight resonance ring

        breathingGain = ctx.createGain();
        breathingGain.gain.setValueAtTime(0, now);

        breathingOsc.connect(breathingFilter);
        breathingFilter.connect(breathingGain);
        breathingGain.connect(ctx.destination);

        breathingOsc.start(now);
    } catch (e) {
        console.error("Breathing synth start failed: ", e);
    }
}

function stopBreathingAudio() {
    if (!audioCtx || !breathingOsc) return;
    const now = audioCtx.currentTime;
    try {
        breathingGain.gain.setValueAtTime(breathingGain.gain.value, now);
        breathingGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);

        const currentOsc = breathingOsc;
        const currentGain = breathingGain;
        breathingOsc = null;
        breathingGain = null;

        setTimeout(() => {
            try {
                currentOsc.stop();
                currentOsc.disconnect();
                currentGain.disconnect();
            } catch(e){}
        }, 600);
    } catch(e){}
}

function triggerBreathingAudioSwell(phaseText) {
    if (!audioCtx || !breathingFilter || !breathingGain) return;
    const now = audioCtx.currentTime;
    
    // Smooth curves for breathe swells
    breathingFilter.frequency.setValueAtTime(breathingFilter.frequency.value, now);
    breathingGain.gain.setValueAtTime(breathingGain.gain.value, now);

    if (phaseText === 'Inhale') {
        // Sweep up: open filter, swell volume
        breathingFilter.frequency.linearRampToValueAtTime(380, now + 4.0);
        breathingGain.gain.linearRampToValueAtTime(0.08 * ambientVolume, now + 4.0);
    } else if (phaseText === 'Hold') {
        // Stay warm and steady
        breathingFilter.frequency.setValueAtTime(380, now);
        breathingGain.gain.setValueAtTime(0.08 * ambientVolume, now);
    } else if (phaseText === 'Exhale') {
        // Sweep down: close filter, drop volume
        breathingFilter.frequency.linearRampToValueAtTime(120, now + 4.0);
        breathingGain.gain.linearRampToValueAtTime(0.0001, now + 4.0);
    }
}

/* ==========================================================================
   6. BREATHING GUIDE SYSTEM (with progress bars and Audio sweeps)
   ========================================================================== */
function initBreathingSpace() {
    const toggleBtn = document.getElementById('breath-toggle-btn');
    const circle = document.getElementById('breathing-circle');
    const textEl = document.getElementById('breathing-text');
    const progressBar = document.getElementById('breathing-progress-bar');
    
    if (!toggleBtn || !circle || !textEl || !progressBar) return;

    let breathInterval = null;
    let isBreathingActive = false;

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

        startBreathingAudio();
        runBreathCycle();
    }

    function runBreathCycle() {
        if (!isBreathingActive) return;

        const phase = phases[currentPhaseIdx];
        textEl.textContent = phase.text;
        
        circle.className = 'breath-circle'; 
        circle.classList.add(phase.class);

        // Animate progression bar width using CSS resets
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        void progressBar.offsetWidth; // force redraw/reflow
        
        progressBar.style.transition = `width ${phase.duration}ms linear`;
        progressBar.style.width = '100%';

        // Audio sweep trigger
        triggerBreathingAudioSwell(phase.text);

        breathInterval = setTimeout(() => {
            currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
            runBreathCycle();
        }, phase.duration);
    }

    function stopBreathing() {
        isBreathingActive = false;
        clearTimeout(breathInterval);
        stopBreathingAudio();
        
        // Reset Visuals
        circle.className = 'breath-circle';
        textEl.textContent = 'Start';
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        
        toggleBtn.textContent = 'Begin Breathwork';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
    }
}

/* ==========================================================================
   7. FLOW TASKS MATRIX SYSTEM (Eisenhower drag-drop, stats & clear buttons)
   ========================================================================== */
function initTasksMatrix() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskQuadrant = document.getElementById('task-quadrant');
    const statsDone = document.getElementById('task-completed-count');
    const statsTotal = document.getElementById('task-total-count');
    const clearCompletedBtns = document.querySelectorAll('.btn-clear-completed');

    if (!taskForm || !taskInput || !taskQuadrant) return;

    let tasks = [];

    try {
        tasks = JSON.parse(localStorage.getItem('zs-tasks')) || [];
    } catch(e) {
        tasks = [];
    }

    renderTasks();
    initDragAndDrop();

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
        
        taskInput.value = '';
        taskInput.focus();
    });

    // Quadrant Clear Buttons
    clearCompletedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const quadrant = btn.getAttribute('data-q');
            const initialCount = tasks.length;
            
            // Filter out completed tasks of this quadrant
            tasks = tasks.filter(t => !(t.quadrant === quadrant && t.completed));
            
            if (tasks.length < initialCount) {
                saveAndRender();
            }
        });
    });

    function renderTasks() {
        const lists = {
            q1: document.getElementById('list-q1'),
            q2: document.getElementById('list-q2'),
            q3: document.getElementById('list-q3'),
            q4: document.getElementById('list-q4')
        };

        Object.values(lists).forEach(list => {
            if (list) list.innerHTML = '';
        });

        let completedCount = 0;

        tasks.forEach(task => {
            const listEl = lists[task.quadrant];
            if (!listEl) return;

            if (task.completed) completedCount++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);
            li.setAttribute('draggable', 'true'); // Make item HTML5 draggable

            li.innerHTML = `
                <div class="task-checkbox-wrapper">
                    <span class="task-checkbox" aria-label="Mark completed"></span>
                </div>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="btn-delete-task" aria-label="Delete task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            `;

            // Checkbox event listeners
            li.querySelector('.task-checkbox-wrapper').addEventListener('click', () => {
                toggleTaskComplete(task.id);
            });

            // Delete event listeners
            li.querySelector('.btn-delete-task').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            // Add drag listeners to this individual list item
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
                li.style.opacity = '0.4';
            });

            li.addEventListener('dragend', () => {
                li.style.opacity = '1';
            });

            listEl.appendChild(li);
        });

        if (statsDone) statsDone.textContent = completedCount;
        if (statsTotal) statsTotal.textContent = tasks.length;
    }

    // HTML5 Drag and Drop listeners on list containers (drop zones)
    function initDragAndDrop() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const targetQuadrant = zone.getAttribute('data-q');
                
                if (taskId && targetQuadrant) {
                    moveTask(taskId, targetQuadrant);
                }
            });
        });
    }

    function moveTask(id, targetQuad) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, quadrant: targetQuad };
            }
            return task;
        });
        saveAndRender();
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
   8. POMODORO TIMER SYSTEM (Configurable Durations & volume)
   ========================================================================== */
function initPomodoroTimer() {
    const timerProgress = document.getElementById('timer-progress');
    const timerCountdown = document.getElementById('timer-countdown');
    const timerLabel = document.getElementById('timer-label');
    const toggleBtn = document.getElementById('timer-toggle-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    
    const soundToggle = document.getElementById('sound-toggle-btn');
    const volSlider = document.getElementById('sound-volume-slider');
    const modeTabs = document.querySelectorAll('.mode-tab');
    
    const adjustDec = document.getElementById('timer-adjust-dec');
    const adjustInc = document.getElementById('timer-adjust-inc');

    if (!timerCountdown || !toggleBtn) return;

    // Load custom settings or fallback
    let sessionDurations = {
        'focus': parseInt(localStorage.getItem('zs-dur-focus')) || 25,
        'short': parseInt(localStorage.getItem('zs-dur-short')) || 5,
        'long': parseInt(localStorage.getItem('zs-dur-long')) || 15
    };

    let activeTabId = 'focus'; // focus, short, long
    let timeTotal = sessionDurations[activeTabId] * 60;
    let timeRemaining = timeTotal;
    let timerInterval = null;
    let isRunning = false;

    updateTimerDisplay();
    updateProgressRing();

    // Mode selection tabs click listeners
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (isRunning) {
                if (!confirm("Discard current active timer session?")) return;
            }
            
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.id === 'mode-focus') {
                activeTabId = 'focus';
                timerLabel.textContent = 'Focus Mode';
            } else if (tab.id === 'mode-short') {
                activeTabId = 'short';
                timerLabel.textContent = 'Short Break';
            } else {
                activeTabId = 'long';
                timerLabel.textContent = 'Long Break';
            }

            timeTotal = sessionDurations[activeTabId] * 60;
            timeRemaining = timeTotal;

            pauseTimer();
            updateTimerDisplay();
            updateProgressRing();
        });
    });

    // Time Increments adjustment triggers (+ / - buttons)
    if (adjustDec) {
        adjustDec.addEventListener('click', () => {
            if (sessionDurations[activeTabId] > 1) {
                sessionDurations[activeTabId]--;
                saveDurations();
                adjustTimerVal(-60);
            }
        });
    }

    if (adjustInc) {
        adjustInc.addEventListener('click', () => {
            sessionDurations[activeTabId]++;
            saveDurations();
            adjustTimerVal(60);
        });
    }

    function adjustTimerVal(deltaSeconds) {
        timeTotal += deltaSeconds;
        timeRemaining = Math.max(0, timeRemaining + deltaSeconds);
        
        // If timer decreases to 0, force reset
        if (timeRemaining === 0) {
            timeRemaining = timeTotal;
        }

        updateTimerDisplay();
        updateProgressRing();
    }

    function saveDurations() {
        localStorage.setItem('zs-dur-focus', sessionDurations.focus);
        localStorage.setItem('zs-dur-short', sessionDurations.short);
        localStorage.setItem('zs-dur-long', sessionDurations.long);
        
        // Update data-time attributes in HTML
        document.getElementById('mode-focus').setAttribute('data-time', sessionDurations.focus);
        document.getElementById('mode-short').setAttribute('data-time', sessionDurations.short);
        document.getElementById('mode-long').setAttribute('data-time', sessionDurations.long);
    }

    // Play & Reset Buttons Controls
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

    // Sound toggle and slider listeners
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const isSoundOn = soundToggle.getAttribute('aria-pressed') === 'true';
            
            if (isSoundOn) {
                soundToggle.setAttribute('aria-pressed', 'false');
                soundToggle.classList.remove('active');
                soundToggle.querySelector('span').textContent = 'Off';
                stopFocusNoise();
            } else {
                soundToggle.setAttribute('aria-pressed', 'true');
                soundToggle.classList.add('active');
                soundToggle.querySelector('span').textContent = 'On';
                if (isRunning && activeTabId === 'focus') {
                    startFocusNoise();
                }
            }
        });
    }

    if (volSlider) {
        // Load default volume if saved
        const savedVol = localStorage.getItem('zs-volume');
        if (savedVol !== null) {
            volSlider.value = savedVol;
            ambientVolume = parseFloat(savedVol) / 100;
        }

        volSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            localStorage.setItem('zs-volume', val);
            updateAmbientVolume(val);
        });
    }

    function startTimer() {
        isRunning = true;
        
        toggleBtn.querySelector('span').textContent = 'Pause';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
        toggleBtn.querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';

        if (soundToggle && soundToggle.getAttribute('aria-pressed') === 'true' && activeTabId === 'focus') {
            startFocusNoise();
        }

        timerInterval = setInterval(() => {
            timeRemaining--;
            
            if (timeRemaining < 0) {
                clearInterval(timerInterval);
                playZenBell();
                alert(`${activeTabId.toUpperCase()} session has completed.`);
                stopFocusNoise();
                
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
        
        toggleBtn.querySelector('span').textContent = 'Start';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
        toggleBtn.querySelector('svg').innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';

        stopFocusNoise();
    }

    function updateTimerDisplay() {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerCountdown.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
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

    function getCircumference() {
        if (!timerProgress) return 596.9;
        const r = timerProgress.r.baseVal.value;
        return 2 * Math.PI * r;
    }

    window.addEventListener('resize', updateProgressRing);
}

/* ==========================================================================
   9. DAILY MOOD LOG SYSTEM (localStorage + Streaks)
   ========================================================================== */
function initMoodTracker() {
    const moodBtns = document.querySelectorAll('.mood-emoji-btn');
    const streakEl = document.getElementById('mood-streak-count');

    if (moodBtns.length === 0) return;

    let moodLogs = [];
    try {
        moodLogs = JSON.parse(localStorage.getItem('zs-mood-logs')) || [];
    } catch(e) {
        moodLogs = [];
    }

    // Highlight today's logged mood if any
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = moodLogs.find(log => log.date === todayStr);
    
    if (todayLog) {
        const activeBtn = document.querySelector(`.mood-emoji-btn[data-mood="${todayLog.mood}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // Calculate and display streak
    updateStreakDisplay();

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedMood = btn.getAttribute('data-mood');
            
            // Remove active style from others
            moodBtns.forEach(b => b.classList.remove('active'));
            
            // Toggle active style
            btn.classList.add('active');

            // Save log
            const logIdx = moodLogs.findIndex(log => log.date === todayStr);
            if (logIdx !== -1) {
                // Update today's mood
                moodLogs[logIdx].mood = selectedMood;
            } else {
                // Add new entry
                moodLogs.push({ date: todayStr, mood: selectedMood });
            }

            localStorage.setItem('zs-mood-logs', JSON.stringify(moodLogs));
            updateStreakDisplay();
        });
    });

    function updateStreakDisplay() {
        if (!streakEl) return;
        streakEl.textContent = calculateStreak(moodLogs);
    }

    function calculateStreak(logs) {
        if (logs.length === 0) return 0;
        
        // Sort logs descending by date
        const sortedDates = logs
            .map(log => new Date(log.date))
            .sort((a, b) => b - a);

        let streak = 0;
        let today = new Date();
        today.setHours(0,0,0,0);
        
        let expectedDate = new Date(today);

        // Check if yesterday or today was logged to count streak
        const firstLogDate = new Date(sortedDates[0]);
        firstLogDate.setHours(0,0,0,0);
        
        const diffTime = Math.abs(today - firstLogDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            // More than 1 day difference from today means streak broken
            return 0;
        }

        // Loop and count sequential dates
        let uniqueDaysStr = [...new Set(logs.map(l => l.date))].sort().reverse();
        
        let checkDate = new Date(today);
        let checkDateStr = checkDate.toISOString().split('T')[0];
        
        // If today isn't logged, start check from yesterday
        if (!uniqueDaysStr.includes(checkDateStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
            checkDateStr = checkDate.toISOString().split('T')[0];
        }

        for (let i = 0; i < uniqueDaysStr.length; i++) {
            if (uniqueDaysStr.includes(checkDateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
                checkDateStr = checkDate.toISOString().split('T')[0];
            } else {
                break;
            }
        }

        return streak;
    }
}
