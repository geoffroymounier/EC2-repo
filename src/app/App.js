import React from 'react';
import NotFound from './views/NotFound';
import ResetPass from './views/ResetPass';
import SuccessReset from './views/SuccessReset';
import Layout from './components/Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

export default function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path='/resetPassword'>
            <ResetPass />
          </Route>
          <Route path='/successReset'>
            <SuccessReset />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
}