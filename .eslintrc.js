module.exports = {
    'extends': 'airbnb-base',
    'root': true,
    'env': {
        'browser': false,
        'es6': true,
    },
    'settings': {
        'import/resolver': {
            'eslint-import-resolver-webpack': {
                config: 'webpack.config.js'
            }
        }
    },
    'rules': {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'linebreak-style': 'off',
        'padded-blocks': [
            'error',
            {
                'blocks': 'never',
                'classes': 'always',
                'switches': 'never'
            }
        ],
        'max-len': [
            'error',
            120,
            4,
            {
                'ignoreUrls': true,
                'ignoreComments': false,
                'ignoreRegExpLiterals': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true
            }
        ],
        'no-underscore-dangle': [
            'error',
            {
                'allowAfterThis': true,
                'allowAfterSuper': false,
                'enforceInMethodNames': false
            }
        ],
        'no-use-before-define': [
            'error',
            {
                'functions': false
            }
        ],
        'import/no-unresolved': [
            'error',
            {
                'ignore': [
                    'app-config.json'
                ]
            }
        ],
        'import/extensions': 'off'
    },
    'overrides': [
        {
            'files': [
                '**/__tests__/**/*.js'
            ],
            'env': {
                'browser': true,
                'jest': true
            },
            'rules': {
                'func-names': ['error', 'as-needed'],
            }
        }
    ]
}