// checkDiskSpaceWrapper.js
let checkDiskSpaceLoaded = null;

const loadCheckDiskSpace = () => {
  if (!checkDiskSpaceLoaded) {
    checkDiskSpaceLoaded = import('check-disk-space').then((module) => module.default);
  }
  return checkDiskSpaceLoaded;
};

export { loadCheckDiskSpace };
