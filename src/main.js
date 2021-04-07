let state = [];

window.onload = () => {
  state = this.loadStateFromStorage();
  this.saveState();
  this.render();
};

function loadStateFromStorage() {
  try {
    const serializedData = localStorage.getItem('state');
    if (!!serializedData) {
      return JSON.parse(serializedData);
    }
  } catch (error) {
    console.log(error);
  }
  return socialMedias.map((socialMedia, key) => {
    return {
      ...socialMedia,
      enabled: true,
      position: key
    }
  });
}

function saveState() {
  try {
    let serializedData = JSON.stringify(state);
    localStorage.setItem('state', serializedData);
  } catch (error) {
    console.log(error);
  }
}

function render() {
  const $administrator = document.getElementById('administrator');
  const _state = this.loadStateFromStorage();
  if (typeof ($administrator) != 'undefined' && $administrator != null) {
    let administratorHtml = '';
    _state.forEach((social, index) => {
      administratorHtml += renderSocialMediasForAdministrator(social, index);
    });
    $administrator.innerHTML = administratorHtml;

    var socialMediaOptions = Array.from(document.querySelectorAll('label[id^="label-"]'));
    for (var i = 0; i < socialMediaOptions.length; i++) {
      var element = socialMediaOptions[i];
      element.addEventListener('click', (event) => {
        key = event.target.getAttribute('data-key');
        checkUncheckSocial(key);
      });
    }
  } else {
    const $principal = document.getElementById('principal');
    const $secondary = document.getElementById('secondary');
    let principalHtml = '';
    _state.forEach(social => {
      if (social.enabled) {
        principalHtml += renderSocialMedias(social);
      }
    });
    let secondaryHtml = '';
    _state.forEach(social => {
      if (!social.enabled) {
        secondaryHtml += renderSocialMedias(social);
      }
    });
    $principal.innerHTML = principalHtml;
    $secondary.innerHTML = secondaryHtml;
  }

}

function checkUncheckSocial(key) {
  const checkBox = document.getElementById('cb-' + key);
  state[key].enabled = !checkBox.checked;
  this.saveState();
}

function renderSocialMedias(social) {
  return `<a id="${social.name}" class="item" href="${social.url}" target="_blank">
            <img src="${social.img}" alt="${social.name}" width="40px"/>
            <span>${social.displayName}</span>
          </a>`;
}

function renderSocialMediasForAdministrator(social, index) {
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