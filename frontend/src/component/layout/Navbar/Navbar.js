import React from 'react'
import Link from 'react-router-dom'
import { useSelector } from 'react-redux'
const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
    return (
        <div>
            <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">FlipZon</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav ms-auto">
        <a class="nav-link active" aria-current="page" href="/">Home</a>
        <a class="nav-link active" href="/products">Products</a>
        <a class="nav-link active" href="/search">Search</a>
        <a class="nav-link active" href="/cart">Cart</a>
        {
          isAuthenticated ?
          <a class="nav-link active" href="/" tabindex="-1" aria-disabled="true">{ user.name }</a>      
        :
        <a class="nav-link active" href="/login" tabindex="-1" aria-disabled="true">Login</a>
          }  </div>
    </div>
  </div>
</nav>
        </div>
    )
}

export default Navbar
