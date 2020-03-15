import Settings, {SettingsData} from './helpers/settings';
import Status from './helpers/status';

const framesAffected = (count: number) => `${count} ${count === 1 ? 'frame' : 'frames'} affected`;
const handleCommand = async (settings: SettingsData, command: string): Promise<string> => {
  const selection = figma.currentPage
                         .selection
                         .filter((node) => node.type === 'FRAME');
  const selected = selection.length;
  if (selected === 0) {
    return 'Please select at least one frame.';
  }
  switch (command) {
    case 'remove-status':
      return Promise.all(selection.map((frame: FrameNode) => Status.remove(frame)))
                    .then(() => `Status removed, ${framesAffected(selected)}.`);
    default:
      const {name} = settings.statuses[command];
      return Promise.all(selection.map((frame: FrameNode) => Status.set(settings, command, frame)))
                    .then(() => `Status updated to '${name}', ${framesAffected(selected)}.`);
  }
};

Settings.load()
        .then((settings) => handleCommand(settings, figma.command))
        .then((message) => figma.closePlugin(message));
