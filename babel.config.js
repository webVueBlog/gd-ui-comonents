module.exports = {
    env: {// 环境变量
        test: {// 测试环境
            presets: [['@babel/preset-env']],// 预设
            plugins: [// 插件
                ['@vue/babel-plugin-jsx', { mergeProps: false, enableObjectSlots: false }],// @vue/babel-plugin-jsx表示vue文件中使用jsx
                '@babel/plugin-proposal-optional-chaining',// 支持可选链
                '@babel/plugin-transform-object-assign',// 支持Object.assign
                '@babel/plugin-proposal-object-rest-spread',// 支持对象扩展运算符
                '@babel/plugin-proposal-export-default-from',// 支持export default from
                '@babel/plugin-proposal-export-namespace-from',// 支持export * from
                '@babel/plugin-proposal-class-properties',// 支持类中的属性
                '@babel/plugin-syntax-dynamic-import',// 支持动态import
                '@babel/plugin-transform-runtime',// 支持transform-runtime
                'transform-require-context',// 支持require.context
            ],
        },
    },
};
