Widget(widget => {
  let ui = {
    main : widget.shadowRoot.querySelector('main'),
    toggle : widget.shadowRoot.querySelector('#toggle'),
    description : widget.shadowRoot.querySelector('p'),
    status : widget.shadowRoot.querySelector('main > output')
  };

  switch (widget.dataset.clientId) {
    case '42' : ui.status.value = 'CUSTOMIZED'; break;
  }
  
  let t = document.createElement('span');
  t.classList.add('clock');
  t.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
  ui.description.appendChild(t);

  ui.toggle.addEventListener('click', event => {
    ui.main.classList.toggle('active');
  });
});