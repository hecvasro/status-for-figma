import Settings, {SettingsData} from './helpers/settings';
import Status from './helpers/status';

const setStatus = async (settings: SettingsData, status: string): Promise<string | undefined> => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    return Promise.resolve('Please select at least one element');
  }
  return Promise.all(selection.map(async (node) => Status.set(settings, status, node)))
                .then(() => undefined);
};

Settings.load()
  .then((settings) => setStatus(settings, figma.command))
  .then((message) => figma.closePlugin(message));
