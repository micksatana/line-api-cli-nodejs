module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": 0,
        "quotes": 0,
        "semi": [
            "error",
            "always"
        ],
        "require-atomic-updates": 0,
        "no-unused-vars": 0
    }
};
