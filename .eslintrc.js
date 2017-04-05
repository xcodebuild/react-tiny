module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
	"parser": "babel-eslint",
	"plugins": ["flowtype"],
    "extends": ["eslint:recommended","plugin:flowtype/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
