name: TypeScript CI

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    defaults:
      run:
        working-directory: ./app
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm install
      
    - name: Type check
      run: npx tsc -b --force
      
    - name: Build project
      run: npm run build
      
    - name: Run lint
      run: npm run lint --if-present
