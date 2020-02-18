import {SettingsData} from './helpers/settings';
import './ui.css';

function dispatchToPlugin(type: string, payload?: any) {
  parent.postMessage({pluginMessage: {type, payload}}, '*');
}

function createSwitch(id: string,checked: boolean,labelText: string,onChange: (event: Event) => void) {
  const wrapper = document.createElement('div');
  const input = document.createElement('input');
  const label = document.createElement('label');

  wrapper.classList.add('switch');

  input.classList.add('switch__toggle');
  input.type = 'checkbox';
  input.id = id;
  input.checked = checked;
  input.onchange = onChange;

  label.classList.add('switch__label');
  label.setAttribute('for', id);
  label.innerText = labelText;

  wrapper.appendChild(input);
  wrapper.appendChild(label);

  return wrapper;
}

const initUI = (settings: SettingsData) => {
  // TODO
};

export interface PluginMessage {
  type: string;
  payload?: any;
}

onmessage = (event) => {
  const pluginMessage = event.data.pluginMessage as PluginMessage;

  switch (pluginMessage.type) {
    case 'init':
      const settings = pluginMessage.payload.settings as SettingsData;
      initUI(settings);
      break;
  }
};
