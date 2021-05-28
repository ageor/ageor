const savePopup = document.createElement('DIV');
const loadPopup = document.createElement('DIV');
const editPoints = document.createElement('DIV');

const popupStyle = {
  position: 'absolute',
  margin: 'auto',
  left: 0,
  right: 0,
  top: '40px',
  width: '300px',
  backgroundColor: 'white',
  display: 'none',
  fontFamily: 'sans-serif',
  padding: '10px',
};

const titleStyle = {
  width: '100%',
  fontSize: '32px',
  textAlign: 'center',
  lineHeight: '50px',
  marginBottom: '10px',
};

const centerStyle = {
  textAlign: 'center',
};

const buttonStyle = {
  backgroundColor: 'steelblue',
  color: 'white',
  textAlign: 'center',
  width: '120px',
  height: '40px',
  fontSize: '24px',
  lineHeight: '40px',
  borderRadius: '6px',
  display: 'inline-block',
  margin: '6px',
  cursor: 'pointer',
  overflow: 'hidden',
};

const labelStyle = {
  fontSize: '24px',
  display: 'inline-block',
  marginLeft: '10px',
  marginRight: '10px',
};

function applyStyle(to, style) {
  for (let s in style) {
    to.style[s] = style[s];
  }
}

applyStyle(savePopup, popupStyle);
applyStyle(loadPopup, popupStyle);
applyStyle(editPoints, popupStyle);

document.body.appendChild(savePopup);
document.body.appendChild(loadPopup);
document.body.appendChild(editPoints);

function buildEditPoints() {
  const title = document.createElement('DIV');
  title.innerText = 'Edit Points';

  applyStyle(title, titleStyle);
  editPoints.appendChild(title);

  //------------

  const editor = document.createElement('TEXTAREA');
  editor.style.resize = 'none';
  editor.style.width = '80px';
  editor.style.height = '200px';

  editPoints.appendChild(editor);

  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  canvas.width = '200';
  canvas.height = '200';

  function draw() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillStyle = '#eee';
    ctx.translate(60.5, 30.5);
    ctx.fillRect(0, 0, 104, 104);

    let first = true;
    ctx.beginPath();
    ctx.translate(2, 2);
    const points = editor.value.split('\n');
    for (let p of points) {
      const xy = p.split(' ').map(v => +v * 100);

      if (first) {
        ctx.moveTo(xy[0], xy[1]);
        first = false;
      } else {
        ctx.lineTo(xy[0], xy[1]);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  editor.onchange = draw;

  editPoints.editor = editor;

  draw();

  editPoints.appendChild(canvas);

  //------------

  const buttons = document.createElement('DIV');

  const confirm = document.createElement('DIV');
  confirm.innerText = 'Confirm';

  applyStyle(confirm, buttonStyle);

  const cancel = document.createElement('DIV');
  cancel.innerText = 'Cancel';

  applyStyle(cancel, buttonStyle);

  cancel.onclick = () => {
    editPoints.style.display = 'none';
  }

  buttons.appendChild(confirm);
  buttons.appendChild(cancel);

  editPoints.confirm = confirm;

  applyStyle(buttons, centerStyle);

  editPoints.appendChild(buttons);
}

let saveData = {};
let saveCb = null;

function buildSave() {
  const title = document.createElement('DIV');
  title.innerText = 'Save Model';

  applyStyle(title, titleStyle);
  savePopup.appendChild(title);

  //-------------
  const saves = JSON.parse(localStorage.getItem('saves') || '[]');

  const ns = document.createElement('DIV');
  applyStyle(ns, centerStyle);

  const createNew = document.createElement('DIV');
  createNew.innerText = 'New';
  
  applyStyle(createNew, buttonStyle);

  createNew.onclick = function() {
    const name = window.prompt('Enter a name', '');
    if (!name) return;

    saves.push(name);

    localStorage.setItem('saves', JSON.stringify(saves));
    localStorage.setItem(name, JSON.stringify(saveData));

    savePopup.style.display = 'none';
  }

  ns.appendChild(createNew);

  savePopup.appendChild(ns);

  savePopup.appendChild(document.createElement('HR'));

  const container = document.createElement('DIV');
  applyStyle(container, centerStyle);
 
  for (let s of saves) {
    const button = document.createElement('DIV');

    button.innerText = s;

    applyStyle(button, buttonStyle);

    button.onclick = function() {
      if (confirm('Overwrite ' + s + '?')) {
        console.log('overwrote');
        localStorage.setItem(s, JSON.stringify(saveData));

        savePopup.style.display = 'none';
      }
    }

    container.appendChild(button);
  }

  savePopup.appendChild(container);

  savePopup.appendChild(document.createElement('HR'));

  //-------------

  const buttons = document.createElement('DIV');

  const cancel = document.createElement('DIV');
  cancel.innerText = 'Close';

  applyStyle(cancel, buttonStyle);

  cancel.onclick = () => {
    savePopup.style.display = 'none';
  }

  buttons.appendChild(cancel);

  applyStyle(buttons, centerStyle);

  savePopup.appendChild(buttons);
}

let loadCB = null;
function buildLoad() {
  const title = document.createElement('DIV');
  title.innerText = 'Save Model';

  applyStyle(title, titleStyle);
  loadPopup.appendChild(title);

  //-------------
  const saves = JSON.parse(localStorage.getItem('saves') || '[]');

  const container = document.createElement('DIV');
  applyStyle(container, centerStyle);
  
  for (let s of saves) {
    const button = document.createElement('DIV');

    button.innerText = s;

    applyStyle(button, buttonStyle);

    container.appendChild(button);

    button.onclick = function() {
      loadCB && loadCB(JSON.parse(localStorage.getItem(s)));

      loadPopup.style.display = 'none';
    }
  }

  loadPopup.appendChild(container);

  loadPopup.appendChild(document.createElement('HR'));

  //-------------

  const buttons = document.createElement('DIV');

  const cancel = document.createElement('DIV');
  cancel.innerText = 'Close';

  applyStyle(cancel, buttonStyle);

  cancel.onclick = () => {
    loadPopup.style.display = 'none';
  }

  buttons.appendChild(cancel);

  applyStyle(buttons, centerStyle);

  loadPopup.appendChild(buttons);
}

buildEditPoints();
buildSave();
buildLoad();

export function modPoints(points, cb) {
  let text = '';

  for (let p of points) {
    text += p.join(' ') + '\n';
  }

  editPoints.style.display = 'block';

  editPoints.editor.value = text.trim();
  editPoints.editor.onchange();

  editPoints.confirm.onclick = () => {
    points.length = 0;

    const pts = editPoints.editor.value.trim().split('\n');
    for (let p of pts) {
      points.push(p.split(' ').map(v => +v));
    }

    editPoints.style.display = 'none';

    cb && cb();
  }
}

export function saveModel(data) {
  savePopup.style.display = 'block';

  saveData = data;
}

export function loadModel(cb) {
  loadPopup.style.display = 'block';

  loadCB = cb;
}
