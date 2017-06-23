import * as React from 'react';
import App from './App';
import Core from './components/Core';
import { observer } from 'mobx-react';

interface Props { app: App; }

@observer
class Root extends React.Component<Props, {}> {

  render() {
    const { route } = this.props.app;
    return (
      <div>
        {route && <Core children={route} />}
      </div>
    );
  }
}

export default Root;
