export default {
  SPLIT_HORIZONTAL: {
    LEFT: {
      point: { top: '50%', left: '25%' },
      area: { top: '0%', left: '0%', width: '50%', height: '100%' },
    },
    RIGHT: {
      point: { top: '50%', right: '25%' },
      area: { top: '0%', right: '0%', width: '50%', height: '100%' },
    },
  },
  SPLIT_VERTICAL: {
    TOP: {
      point: { top: '25%', left: '50%' },
      area: { top: '0%', left: '0%', width: '100%', height: '50%' },
    },
    BOTTOM: {
      point: { bottom: '25%', left: '50%' },
      area: { bottom: '0%', left: '0%', width: '100%', height: '50%' },
    },
  },
  ATTACH_HORIZONTAL: {
    LEFT: {
      point: { top: '50%', left: '10%' },
      area: { top: '0%', left: '0%', width: '20%', height: '100%' },
    },
    RIGHT: {
      point: { top: '50%', right: '10%' },
      area: { top: '0%', right: '0%', width: '20%', height: '100%' },
    },
  },
  ATTACH_VERTICAL: {
    TOP: {
      point: { top: '10%', left: '50%' },
      area: { top: '0%', left: '0%', width: '100%', height: '20%' },
    },
    BOTTOM: {
      point: { bottom: '10%', left: '50%' },
      area: { bottom: '0%', left: '0%', width: '100%', height: '20%' },
    },
  },
  ATTACH_SIDES: {
    LEFT: {
      point: { top: '50%', left: '1.5rem' },
      area: { top: '0%', left: '0%', width: '3rem', height: '100%' },
    },
    RIGHT: {
      point: { top: '50%', right: '1.5rem' },
      area: { top: '0%', right: '0%', width: '3rem', height: '100%' },
    },
    TOP: {
      point: { top: '1.5rem', left: '50%' },
      area: { top: '0%', left: '0%', width: '100%', height: '3rem' },
    },
    BOTTOM: {
      point: { bottom: '1.5rem', left: '50%' },
      area: { bottom: '0%', left: '0%', width: '100%', height: '3rem' },
    },
  },
  FULL: {
    FULL: {
      point: { top: '50%', left: '50%' },
      area: { inset: '0' },
    },
  },
};
