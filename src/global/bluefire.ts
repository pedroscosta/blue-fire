/* eslint-disable spaced-comment */
/* eslint-disable import/prefer-default-export */
// import store from '../renderer/store/store';

import Extension from '../main/extensions/Extension';

const extensions = {
  async loadExtensions() {
    const exts = await bfCore.getActiveExtensions();

    exts.forEach(async (ext: Extension) => {
      const extMain = await import(/*webpackIgnore: true*/ ext.url);
      console.log(extMain);
      extMain.activate();
    });
  },
};

export { extensions };
