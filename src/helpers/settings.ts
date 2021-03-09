const STORAGE_KEY = 'hecvr/status/settings';

export interface SettingsData {
  statuses: {[key: string]: {name: string, color: RGB}};
  version?: number;
}

const CURRENT_VERSION = 2;

const defaults: SettingsData = {
  statuses: {
    'in-progress': {name: 'In Progress', color: {r: 251/255, g: 140/255, b: 0}},
    'pending-review': {name: 'Pending Review', color: {r: 253/255, g: 216/255, b: 53/255}},
    'changes-requested': {name: 'Changes Requested', color: {r: 229/255, g: 57/255, b: 53/255}},
    'done': {name: 'Done / Approved', color: {r: 67/255, g: 160/255, b: 71/255}},
    'ready-for-development': {name: 'Ready for Development', color: {r: 87/255, g: 67/255, b: 160/255}},
    'in-production': {name: 'In Production', color: {r: 160/255, g: 67/255, b: 160/255}}
  },
  version: 2,
};

const load = async (): Promise<SettingsData> => {
  return figma.clientStorage.getAsync(STORAGE_KEY)
                            .then((settings) => {
                              if (!settings || settings.version < CURRENT_VERSION) {
                                // no harm on going back to defaults, users cannot edit statuses
                                // just yet
                                return update(defaults);
                              }
                              return settings;
                            })
};

const update = async (settings: SettingsData): Promise<SettingsData> => {
  return figma.clientStorage.setAsync(STORAGE_KEY, settings)
                            .then(() => settings);
};

export default { load, update };
