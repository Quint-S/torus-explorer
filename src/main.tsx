import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import App from './App'
import { GlobalStyle } from './styles/global'
import './index.css'; 

const getApolloClient = () => {
  const isTestnet = window.location.host.startsWith('test')
  return new ApolloClient({
    uri: isTestnet 
      ? 'https://api.subquery.network/sq/torus-explorer/torus-test-net'
      : 'https://api.subquery.network/sq/CommuneExplorer/torus-indexer',
    cache: new InMemoryCache(),
  })
}
console.log(window.location.host, 'LOC')

const client = getApolloClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GlobalStyle />
      <App />
    </ApolloProvider>
  </React.StrictMode>
)