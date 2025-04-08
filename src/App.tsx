import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import Header from './components/Header'
import Main from './components/Main'
import Article from './components/Article'
import SignUp from './components/Authentication/SignUp'
import SignIn from './components/Authentication/SignIn'
import EditProfile from './components/LoggedIn/EditProfile'
import CreateArticle from './components/LoggedIn/CreateArticle'
import UpdateAnArticle from './components/LoggedIn/UpdateAnArticle'
import store from './store'

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Switch>
          <Route path="/" component={Main} exact />
          <Route path="/articles/:slug" component={Article} exact />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/edit-profile" component={EditProfile} />
          <Route path="/articles/:slug/edit" component={UpdateAnArticle} />
          <Route path="/new-article" component={CreateArticle} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
