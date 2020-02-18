import Settings, {SettingsData} from './helpers/settings';
import Status from './helpers/status';

const setStatus = async (settings: SettingsData, status: string): Promise<string> => {
  const { selection } = figma.currentPage;
  if (selection.length === 0) {
    return Promise.resolve('Please select at least one element.');
  }
  return Promise.all(selection.map(async (node): Promise<string> => {
                                if (node.type !== 'FRAME') {
                                  return `Element '${node.name}' is not a frame, please select a frame.`;
                                }
                                return Status.set(settings, status, node as FrameNode)
                                             .then(() => `Element '${node.name}' status is now '${settings.statuses[status].name}'.`);
                              }))
                .then((messages) => messages.join('; '));
};

Settings.load()
  .then((settings) => setStatus(settings, figma.command))
  .then((message) => figma.closePlugin(message));
