module.exports = {// 继承eslint的规则
    root: true,// 设置为true表示只检查该文件，不检查其他文件
    ecmaFeatures: {// 设置为true表示支持jsx语法
        jsx: true,
    },
    env: {// 设置环境变量
        browser: true,// 设置为true表示支持浏览器环境
        node: true,// 设置为true表示支持node环境
        es6: true,// 设置为true表示支持es6语法
    },
    parser: 'vue-eslint-parser',// 使用vue-eslint-parser解析器
    parserOptions: {// 设置解析器的选项
        ecmaVersion: 12,// 设置ecma版本为12
        parser: '@typescript-eslint/parser',// 使用@typescript-eslint/parser解析器
        sourceType: 'module',// 设置为module表示支持es6模块化语法
    },
    extends: [
        'plugin:vue/vue3-recommended',// 继承vue的规则
        'plugin:import/recommended',// 继承import的规则
        'plugin:import/typescript',// 继承import的typescript规则
        'prettier',// 继承prettier的规则
    ],
    plugins: ['markdown', '@typescript-eslint', 'import'],// 使用的插件
    rules: {
        // override/add rules settings here, such as:
        '@typescript-eslint/no-explicit-any': 'off',// @typescript-eslint/no-explicit-any表示不检查显式的any类型
        '@typescript-eslint/ban-ts-comment': 'off',// @typescript-eslint/ban-ts-comment表示不检查ts注释
        'vue/v-on-event-hyphenation': 'off',// vue/v-on-event-hyphenation表示不检查v-on事件驼峰命名
        'vue/multi-word-component-names': 'off',// vue/multi-word-component-names表示不检查多单词组件命名
        'import/no-unresolved': 'off',// import/no-unresolved表示不检查未解析的模块
        'import/extensions': 'off',// import/extensions表示不检查文件扩展名
        'import/no-absolute-path': 'off',// import/no-absolute-path表示不检查绝对路径
        'import/no-extraneous-dependencies': 'off',// import/no-extraneous-dependencies表示不检查额外的依赖
        'vue/no-unused-vars': 'off',// vue/no-unused-vars表示不检查未使用的变量
    },
    globals: {// 定义全局变量
        h: true,// 定义全局变量h为true
    },
};
