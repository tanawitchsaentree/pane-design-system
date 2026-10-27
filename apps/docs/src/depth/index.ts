// Usage-tab content per component. A component missing here renders its first-edition notes and
// fails G-K2 until its depth file is written.
import type { Depth } from './types';
import { AVATAR } from './avatar';
import { BADGE } from './badge';
import { BANNER } from './banner';
import { BUTTON } from './button';
import { CARD } from './card';
import { CHIP } from './chip';
import { ICON_BUTTON } from './icon-button';
import { CHECKBOX, FIELDSET, FORM_FIELD, HELPER_TEXT, INPUT, INPUT_GROUP, LABEL, PIN_INPUT, RADIO, SWITCH, TEXTAREA } from './forms';
import { CONTAINER, ENVIRONMENT, GRID, STACK } from './layout';
import { SELECT, SLIDER } from './select';
import { TABS } from './tabs';
import { TAG } from './tag';

export const DEPTH: Record<string, Depth> = { Checkbox: CHECKBOX, Fieldset: FIELDSET, FormField: FORM_FIELD, HelperText: HELPER_TEXT, Input: INPUT, InputGroup: INPUT_GROUP, Label: LABEL, PinInput: PIN_INPUT, Radio: RADIO, Switch: SWITCH, Textarea: TEXTAREA, Avatar: AVATAR, Badge: BADGE, Banner: BANNER, Button: BUTTON, Card: CARD, Chip: CHIP, Container: CONTAINER, Environment: ENVIRONMENT, Grid: GRID, IconButton: ICON_BUTTON, Select: SELECT, Slider: SLIDER, Stack: STACK, Tabs: TABS, Tag: TAG };
