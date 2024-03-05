
function pascalCase(name) {
    return (
        name.charAt(0).toUpperCase() +
        name.slice(1).replace(/-(\w)/g, (m, n) => n.toUpperCase())
    );
}

const req = require.context(
    './components',
    true,
    /^\.\/[^_][\w-]+\/style\/index\.tsx?$/,
);

req.keys().forEach((mod) => {// 忽略message和notification模块
    let v = req(mod);// 获取模块导出的内容
    if (v && v.default) {// 如果模块导出的是一个default对象
        v = v.default;// 获取default对象
    }
    const match = mod.match(/^\.\/([^_][\w-]+)\/index\.tsx?$/);// 匹配模块路径中的组件名
    if (match && match[1]) {// 如果匹配成功
        if (match[1] === 'message' || match[1] === 'notification') {
            // 忽略message和notification模块
            // message & notification should not be capitalized
            exports[match[1]] = v;// 导出模块的default对象
        } else {
            exports[pascalCase(match[1])] = v;// 导出模块的default对象，并转换为PascalCase
        }
    }
});

module.exports = exports;
