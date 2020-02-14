import {SettingsData} from './settings';

const PLUGIN_DATA_KEY = 'hecvr/status';

const DEFAULT_COLOR: RGB = {r: 0, g: 0, b: 0};
const DEFAULT_FONT_NAME: FontName = {family: 'Roboto', style: 'Regular'};

interface ComponentData {
  version?: number;
  id?: string;
}

interface InstanceData {
  status?: string;
  id?: string;
}

const getComponent = async (): Promise<ComponentNode> => {
  let component = figma.getNodeById(figma.root.getPluginData(PLUGIN_DATA_KEY)) as ComponentNode;
  if (component) {
    return component;
  }
  component = figma.createComponent();
  component.resize(320, 588);
  component.name = 'Status';
  component.backgrounds = [];
  component.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'};
  component.locked = true;

  // add badge
  const badgeBackground = figma.createRectangle();
  badgeBackground.resize(120, 30);
  badgeBackground.name = 'Status Badge Background';
  badgeBackground.fills = [{type: 'SOLID', color: DEFAULT_COLOR}];
  badgeBackground.cornerRadius = 4.0;
  badgeBackground.bottomLeftRadius = 0;
  badgeBackground.bottomRightRadius = 0;
  badgeBackground.constraints = {horizontal: 'MIN', vertical: 'MIN'};
  
  await figma.loadFontAsync(DEFAULT_FONT_NAME);
  const badgeText = figma.createText();
  badgeText.resize(120, 30);
  badgeText.name = 'Status Badge Text';
  badgeText.textAlignHorizontal = 'CENTER';
  badgeText.textAlignVertical = 'CENTER';
  badgeText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
  badgeText.constraints = {horizontal: 'MIN', vertical: 'MIN'}

  const badge = figma.group([badgeBackground, badgeText], component);
  badge.resize(120, 30);
  badge.name = 'Status Badge';

  component.appendChild(badge);

  // add borders
  const borders = figma.createRectangle();
  borders.resize(320, 558);
  borders.name = 'Status Borders';
  borders.y = 30;
  borders.fills = [];
  borders.strokes = [{type: 'SOLID', color: DEFAULT_COLOR}];
  borders.strokeAlign = 'INSIDE';
  borders.strokeWeight = 10;
  borders.cornerRadius = 4.0;
  borders.topLeftRadius = 0;
  borders.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'};

  component.appendChild(borders);

  // set plugin data for root
  figma.root.setPluginData(PLUGIN_DATA_KEY, component.id);

  return component;
};

const updateInstance = async (settings: SettingsData, status: string, instance: InstanceNode): Promise<void> => {
  const {name, color} = settings.statuses[status];

  // update badge
  const badge = instance.findOne((node) => node.name === 'Status Badge') as GroupNode;

  const badgeBackground = badge.findOne((node) => node.name === 'Status Badge Background') as RectangleNode;
  badgeBackground.fills = [{type: 'SOLID', color}];

  await figma.loadFontAsync(DEFAULT_FONT_NAME);
  const badgeText = badge.findOne((node) => node.name === 'Status Badge Text') as TextNode;
  badgeText.characters = name;

  // update borders
  const borders = instance.findOne((node) => node.name === 'Status Borders') as RectangleNode;
  borders.strokes = [{type: 'SOLID', color}];
};

const set = async (settings: SettingsData, status: string, frame: FrameNode): Promise<void> => {
  const rawData = frame.getPluginData(PLUGIN_DATA_KEY);
  let data: InstanceData = {};
  if (rawData) {
    data = JSON.parse(rawData) as InstanceData;
  }

  let instance = figma.getNodeById(data.id) as InstanceNode;
  if (instance) {
    // update component instance
    await updateInstance(settings, status, instance);
  } else {
    const component = await getComponent();

    // create instance
    instance = component.createInstance();
    instance.resize(frame.width + 20, frame.height + 50);
    instance.x = -10;
    instance.y = -40;
    instance.constraints = {horizontal: 'STRETCH', vertical: 'STRETCH'};
    // update component instance
    await updateInstance(settings, status, instance);

    // add component instance to frame
    frame.appendChild(instance);
  }

  // set plugin data for node
  frame.setPluginData(PLUGIN_DATA_KEY, JSON.stringify({status, id: instance.id}));
};

export default { set };
