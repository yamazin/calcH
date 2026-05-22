const config = {
  A12: { frontConst: 18, rearConst: 16, fTire: 41.0, fSim: 1.0, rTire: 42.0, rSim: 0.5 },
  F103: { frontConst: 23, rearConst: 18, fTire: 48.0, fSim: 2.5, rTire: 48.0, rSim: 2.0 },
  'F103-S': { frontConst: 19, rearConst: 15, fTire: 41.0, fSim: 2.5, rTire: 42.0, rSim: 2.0 }
};

let currentState = {
  chassis: 'A12',
  frontTire: 41.0,
  frontSim: 1.0,
  rearTire: 42.0,
  rearSim: 0.5
};

function setChassis(name) {
  currentState.chassis = name;
  
  // Update defaults based on chassis
  const c = config[name];
  currentState.frontTire = c.fTire;
  currentState.frontSim = c.fSim;
  currentState.rearTire = c.rTire;
  currentState.rearSim = c.rSim;

  // Update UI
  document.querySelectorAll('.chassis-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === name);
  });

  updateUI();
  haptic();
}

function changeVal(key, delta) {
  currentState[key] = Math.round((currentState[key] + delta) * 10) / 10;
  // rearSimのみマイナス値を許容する。それ以外は0未満にならないように制限
  if (key !== 'rearSim' && currentState[key] < 0) {
    currentState[key] = 0;
  }
  
  updateUI();
  haptic();
}

function updateUI() {
  // Update displays
  document.getElementById('frontTire-display').innerText = currentState.frontTire.toFixed(1);
  document.getElementById('frontSim-display').innerText = currentState.frontSim.toFixed(1);
  document.getElementById('rearTire-display').innerText = currentState.rearTire.toFixed(1);
  document.getElementById('rearSim-display').innerText = currentState.rearSim.toFixed(1);

  // Calculate: 
  // Front Ride Height = (Tire / 2) + Sim - Const
  // Rear Ride Height = (Tire / 2) - Sim - Const
  const c = config[currentState.chassis];
  const frontRH = (currentState.frontTire / 2) + currentState.frontSim - c.frontConst;
  const rearRH = (currentState.rearTire / 2) - currentState.rearSim - c.rearConst;

  document.getElementById('frontResult').innerText = frontRH.toFixed(1);
  document.getElementById('rearResult').innerText = rearRH.toFixed(1);
}

function haptic() {
  if (window.navigator.vibrate) {
    window.navigator.vibrate(5);
  }
}

// Initial call
updateUI();
