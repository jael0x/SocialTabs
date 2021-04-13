let state = [];

window.onload = () => {
  state = loadState();
  saveState();
  render();
};

window.onmousewheel = (e) => {
  if (e.wheelDelta < 0)
    showMore();
  else {
    const secondary = document.getElementById('secondary');
    secondary.style.display = 'none';
  }
}

function showMore() {
  const secondary = document.getElementById('secondary');
  secondary.style.display = 'grid';
}

function loadState() {
  let _state = [];
  try {
    const serializedData = localStorage.getItem('state');
    const storedVersion = localStorage.getItem('version');
    if (!!serializedData) {
      _state = [...JSON.parse(serializedData)];
      if (!storedVersion || !!storedVersion && version > storedVersion) {
        _state = [...socialMedias.map((socialMedia, key) => {
          const previousState = _state.find(item => item.name === socialMedia.name);
          if (previousState)
            return { ...previousState, ...socialMedia };
          else
            return {
              ...socialMedia,
              enabled: true,
              position: key
            };
        })];
        localStorage.setItem('version', version);
      }
    } else {
      _state = [...socialMedias.map((socialMedia, key) => {
        return {
          ...socialMedia,
          enabled: true,
          position: key
        }
      })];
    }
  } catch (error) {
    console.error(error);
  }
  return [..._state];
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
  const _state = loadState();
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

    const $moreBubble = document.getElementById('more-bubble');
    $moreBubble.addEventListener('click', () => showMore());

    let principalHtml = '';
    const itemsForPrincipal = _state.filter(item => item.enabled);
    itemsForPrincipal.forEach(social => principalHtml += renderSocialMedias(social));

    switch (itemsForPrincipal.length) {
      case 0:
      case 1:
        $principal.classList.add('container-1');
        break;
      case 2:
        $principal.classList.add('container-2');
        break;
      default:
        $principal.classList.add('container-3');
        break;
    }

    let secondaryHtml = '';
    const itemsForSecondary = _state.filter(item => !item.enabled);
    itemsForSecondary.forEach(social => secondaryHtml += renderSocialMedias(social));

    $principal.innerHTML = principalHtml;
    $secondary.innerHTML = secondaryHtml;
  }
}

function checkUncheckSocial(key) {
  const checkBox = document.getElementById('cb-' + key);
  state[key].enabled = !checkBox.checked;
  saveState();
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