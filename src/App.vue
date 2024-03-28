<template>
  <nav class="nav-bar">
    <span class="component-header">Welcome to Roulette App</span>
    <div class="nav-actions">
      <router-link class="router-button" to="/">Home</router-link> |
      <router-link class="router-button" to="/statistics">
        Statistics
      </router-link>
    </div>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 22px;
  text-align: center;
  color: #2c3e50;
}

.nav-bar {
  display: flex;
  padding: 30px;
  border-bottom: 1px solid rgb(220, 220, 220);
  margin-bottom: 20px;

  .component-header {
    margin-right: auto;
  }

  .nav-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20%;
    gap: 15px;
  }
}

.router-button {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;

  &.router-link-exact-active {
    color: #42b983;
  }
}
</style>
