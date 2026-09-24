import cardalive from './cardalive.js';
import pocus from './pocus.js';
import knockout from './knockout.js';
import npc from './npc.js';
import rag from './rag.js';
import snake from './snake.js';

// A project's `viz` key picks its illustration. Each scene is
// { label (for screen readers), labels ([text, x%, y%]), still (seconds), draw(kit, t) }.
export const VIZ = { cardalive, pocus, knockout, npc, rag, snake };
