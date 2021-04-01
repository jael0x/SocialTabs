const socialMedias = getSocialMedias();

let store;

window.onload = function () {

  const initialData = this.loadState();

  store = Redux.createStore(reducer, initialData, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

  store.subscribe(function () {
    this.saveState(store.getState());
    this.render();
  });


  this.render();
};

function reducer(store = [], action) {
  switch (action.type) {
    case 'CHECK_SOCIAL':
      return [...store];
    default:
      return store;
  }
}

function selectSocial() {
  var socialMediaOptions = Array.from(document.querySelectorAll('label[id^="label-"]'));

  for (var i = 0; i < socialMediaOptions.length; i++) {
    var element = socialMediaOptions[i];
    element.addEventListener('click', (event) => {
      key = event.target.getAttribute('data-key');
      console.log(key);
      checkSocial(key);
    });
  }
};

function checkSocial(key) {
  const checkBox = document.getElementById('cb-' + key);
  let socialMediaStore = store.getState();
  social = socialMediaStore[key];
  console.log(checkBox.checked);
  if (!checkBox.checked) {
    social.enabled = true;
  } else {
    social.enabled = false;
  }
  console.log(socialMediaStore);
  store.dispatch({
    type: 'CHECK_SOCIAL',
  });
}

function render() {
  const $principal = document.getElementById('principal');
  const $secondary = document.getElementById('secondary');
  const $administrator = document.getElementById('administrator');
  const socialMediaStore = store.getState();

  if (typeof ($principal) != 'undefined' && $principal != null) {
    let principalHtml = '';

    socialMediaStore.forEach(social => {
      if (social.enabled) {
        principalHtml += renderSelectedSocialMedias(social);
      }
    });

    $principal.innerHTML = principalHtml;
  }

  if (typeof ($secondary) != 'undefined' && $secondary != null) {
    let secondaryHtml = '';

    socialMediaStore.forEach(social => {
      if (!social.enabled) {
        secondaryHtml += renderSelectedSocialMedias(social);
      }
    });

    $secondary.innerHTML = secondaryHtml;
  }

  if (typeof ($administrator) != 'undefined' && $administrator != null) {
    let administratorHtml = '';
    socialMediaStore.forEach((social, index) => {
      administratorHtml += renderSocialMedias(social, index);
    });
    $administrator.innerHTML = administratorHtml;
  }

  this.selectSocial();
}

function renderSelectedSocialMedias(social) {
  return `<a id="${social.name}" class="item" href="${social.url}" target="_blank">
            <img src="${social.img}" alt="${social.name}" width="40px"/>
            <span>${social.displayName}</span>
          </a>`;
}

function renderSocialMedias(social, index) {
  if (social.enabled) {
    return `<a  id="${social.name}" class="item">
              <input type="checkbox" id="cb-${index}" checked/>
              <label for="cb-${index}" id="label-${index}" data-key="${index}">
                  <img src="${social.img}" alt="${social.name}" width="40px">
              </label>
              <span>${social.displayName}</span>
            </a>`;
  } else {
    return `<a  id="${social.name}" class="item">
              <input type="checkbox" id="cb-${index}"/>
              <label for="cb-${index}" id="label-${index}" data-key="${index}">
                <img src="${social.img}" alt="${social.name}" width="40px">
              </label>
              <span>${social.displayName}</span>
            </a>`;
  }
}

function loadState() {
  try {
    const serializedData = localStorage.getItem('state')
    if (serializedData === null) {
      console.log('No hay el texto');
      return socialMedias
    }
    return JSON.parse(serializedData)
  } catch (error) {
    console.log(error);
    return socialMedias
  }
}

function saveState(state) {
  try {
    let serializedData = JSON.stringify(state);
    localStorage.setItem('state', serializedData)
  } catch (error) {
    console.log(error);
  }
}