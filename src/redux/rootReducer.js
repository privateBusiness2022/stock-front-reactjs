import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import usersReducer from './slices/users';
import periodsReducer from './slices/periods';
import investorsReducer from './slices/investor';
import stagesReducer from './slices/dividing';
import requestsReducer from './slices/request';
import projectsReducer from './slices/projects';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  users: usersReducer,
  projects: projectsReducer,
  requests: requestsReducer,
  periods: periodsReducer,
  stages: stagesReducer,
  investors: investorsReducer,
  product: persistReducer(productPersistConfig, productReducer),
});

export { rootPersistConfig, rootReducer };
