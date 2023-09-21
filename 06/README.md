# Linter already worked.

##### Just copy .eslintrc.js file to the root of the project directory.

##### Make sure you have the next lines in your package.json file and run 'npm install':
``` 
  "devDependencies": {
    "eslint": "^8.34.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^6.1.1",
    "husky": "^4.3.8",
    "lint-staged": "^13.1.2"
  },
  "lint-staged": {
    "*.js": [
      "eslint"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
```

##### Please, install ESLint extension for your code editor
##### In case modules import showing error reopen your editor