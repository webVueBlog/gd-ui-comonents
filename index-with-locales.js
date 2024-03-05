const antd = require('./components');// 导入组件

const req = require.context('./components', true, /^\.\/locale\/.+_.+\.tsx$/);// 导入语言包

antd.locales = {};// 导入语言包

req.keys().forEach((mod) => {
    const matches = mod.match(/\/([^/]+).tsx$/);// 获取语言包名称
    antd.locales[matches[1]] = req(mod).default;// 注册语言包
});

module.exports = antd;// 导入组件
