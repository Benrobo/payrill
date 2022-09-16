import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import "./App.css"
import ProtectedRoute from './components/ProtectedRoute'
import { DataContextProvider } from './context/DataContext'
import TransactionActivities from './pages/Activities/Transaction'
import Authentication from './pages/Auth/auth'
import HotelBooking from './pages/Bookings/Hotel'
import CryptoCurrencies from './pages/Crypto/CryptoCurrencies'
import Dashboard from './pages/Dashboard'
import OrgDashboard from './pages/Dashboard/OrgDashboard'
import Ecart from './pages/Ecart/Ecart'
import TopUp from './pages/Payments/TopUp'
import Transfer from './pages/Payments/Transfer'
import Withdraw from './pages/Payments/Withdraw'
import Products from './pages/Products/Products'
import UserProfile from './pages/Profile/User'
import Scanner from './pages/Scanner/scanner'
import Store from './pages/Store/Store'
import OrgSettings from './pages/UserSettings/OrgSettings'
import Verify from './pages/Verify/Verify'
import VirtualCards from './pages/VirtualCards'



function App() {

  return (
    <DataContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path='/dashboard' element={
              <ProtectedRoute children={<Dashboard />} />
            } />
            <Route path='/profile' element={
              <ProtectedRoute children={<UserProfile />} />
            } />
            <Route path='/payment/transfer' element={
              <ProtectedRoute children={<Transfer />} />
            } />
            <Route path='/payment/withdraw' element={
              <ProtectedRoute children={<Withdraw />} />
            } />
            <Route path='/payment/topup' element={
              <ProtectedRoute children={<TopUp />} />
            } />
            <Route path='/scanner' element={
              <ProtectedRoute children={<Scanner />} />
            } />
            <Route path='/booking' element={
              <ProtectedRoute children={<HotelBooking />} />
            } />
            <Route path='/ecart' element={
              <ProtectedRoute children={<Ecart />} />
            } />
            <Route path='/crypto' element={
              <ProtectedRoute children={<CryptoCurrencies />} />
            } />
            <Route path='/cards/vc' element={
              <ProtectedRoute children={<VirtualCards />} />
            } />
            <Route path='/transactions/activities' element={
              <ProtectedRoute children={<TransactionActivities />} />
            } />
            {/* organization stores */}
            <Route path='/store/:store_name' element={
              <ProtectedRoute children={<OrgDashboard />} />
            } />
            <Route path='/store' element={
              <ProtectedRoute children={<Store />} />
            } />
            <Route path='/store/:store_name/verify' element={
              <ProtectedRoute children={<Verify />} />
            } />
            <Route path='/store/:store_name/products' element={
              <ProtectedRoute children={<Products />} />
            } />
            <Route path='/store/:store_name/settings' element={
              <ProtectedRoute children={<OrgSettings />} />
            } />
            <Route path='/auth' element={<Authentication />} />
          </Routes>
        </Router>
      </div>
    </DataContextProvider>
  )
}

export default App
