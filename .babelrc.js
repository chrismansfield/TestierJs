module.exports = {
    'presets': [
        '@babel/preset-env',
    ],
    plugins: [
        '@babel/plugin-transform-runtime'
    ]
//    "env": {
//        "test": {
//            "presets": [
//                [
//                    "env",
//                    {
//                        "targets":{
//                            "node": "current",
//                            "browser": "last 2 versions"
//                        }
//                    }
//                ],
//                "stage-3"
//            ],
//            "plugins": [
//                "transform-es2015-modules-commonjs"
//            ]
//        }
//    }
};
