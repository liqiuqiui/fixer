import { FC, PropsWithChildren, useEffect } from 'react';
import { Provider } from 'react-redux';
import './app.scss';
import './assets/css/icon-font.css';
import store from './store';
import './router';
import { useInitStore } from './hooks';

const WrapStore: FC<PropsWithChildren> = ({ children }) => {
  const initStore = useInitStore();
  useEffect(() => {
    initStore();
  }, []);

  return <>{children}</>;
};

const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <WrapStore>{children}</WrapStore>
    </Provider>
  );
};

export default App;
