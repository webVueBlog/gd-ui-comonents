// webpack 相关插件
const chalk = require('chalk');// 终端美化
const RemovePlugin = require('remove-files-webpack-plugin');// 删除文件插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');// 打包分析插件
const { ESBuildMinifyPlugin } = require('esbuild-loader');// 压缩js插件
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');// 检查重复依赖插件
const getWebpackConfig = require('./tools/getWebpackConfig');// 获取webpack配置文件
const compactVars = require('./scripts/compact-vars');// 压缩less变量插件
function injectLessVariables(config, variables) {// 注入less变量
    (Array.isArray(config) ? config : [config]).forEach((conf) => {// 遍历配置文件数组
        conf.module.rules.forEach((rule) => {// 遍历规则数组
            if (rule.test instanceof RegExp && rule.test.test('.less')) {// 判断规则是否为less规则
                const lessRule = rule.use[rule.use.length - 1];// 获取less规则
                if (lessRule.options.lessOptions) {// 判断less规则是否有less选项
                    lessRule.options.lessOptions.modifyVars = {// 注入less变量
                        ...lessRule.options.lessOptions.modifyVars,// 合并变量
                        ...variables,// 注入自定义变量
                    };
                } else {
                    lessRule.options.modifyVars = {// 注入less变量
                        ...lessRule.options.modifyVars,// 合并变量
                        ...variables,// 注入自定义变量
                    };
                }
            }
        });
    });

    return config;
}

/**
 *  添加国际化支持
 * @param webpackConfig
 */
function addLocales(webpackConfig) {
    let packageName = 'das-with-locales';// 打包后的包名
    if (webpackConfig.entry['das.min']) {// 如果存在压缩后的入口文件
        packageName += '.min';// 添加压缩后缀
    }
    webpackConfig.entry[packageName] = './index-with-locales.js';// 添加国际化入口文件
    webpackConfig.output.filename = '[name].js';// 修改打包后的文件名
}

/**
 *  添加dayjs依赖
 * @param config
 */
function externalDayjs(config) {// 添加dayjs依赖
    config.externals.push({// 添加dayjs依赖
        dayjs: {// 配置dayjs的导出名称
            root: 'dayjs',// 配置dayjs的root导出名称
            commonjs2: 'dayjs',// 配置dayjs的commonjs2导出名称
            commonjs: 'dayjs',// 配置dayjs的commonjs导出名称
            amd: 'dayjs',// 配置dayjs的amd导出名称
        },
    });
    config.externals.push(function ({ _context, request }, callback) {// 添加dayjs插件依赖
        if (/^dayjs\/plugin\//.test(request)) {// 如果请求的模块是dayjs插件
            const name = request.replaceAll('/', '_');// 替换路径分隔符为下划线
            return callback(null, {// 返回一个对象，配置dayjs插件的导出名称
                root: name,// 配置dayjs插件的root导出名称
                commonjs2: name,// 配置dayjs插件的commonjs2导出名称
                commonjs: name,// 配置dayjs插件的commonjs导出名称
                amd: name,// 配置dayjs插件的amd导出名称
            });
        }
        callback();// 否则继续处理其他依赖
    });
}

/**
 *  添加警告条件
 * @param config
 */
function injectWarningCondition(config) {// 添加警告条件
    config.module.rules.forEach((rule) => {// 遍历所有规则
        if (rule.test.test('test.tsx')) {// 如果规则测试的是tsx文件
            rule.use = [// 修改规则的use数组
                ...rule.use,// 保留之前的use配置
                {
                    loader: 'string-replace-loader',// 使用string-replace-loader
                    options: {// 配置loader选项
                        search: 'devWarning(',// 搜索字符串
                        replace:
                            "if (process.env.NODE_ENV !== 'production') devWarning(",// 替换字符串
                    },
                },
            ];
        }
    });
}

/**
 *  处理webpack主题配置
 * @param themeConfig
 * @param theme
 * @param vars
 */
function processWebpackThemeConfig(themeConfig, theme, vars) {// 处理webpack主题配置
    themeConfig.forEach((config) => {// 遍历所有配置
        externalDayjs(config);// 添加dayjs插件

        Object.keys(config.entry).forEach((entryName) => {// 遍历所有入口
            const originPath = config.entry[entryName];// 获取原始路径
            let replacedPath = [...originPath];// 克隆原始路径

            if (originPath.length === 1 && originPath[0] === './index') {// 如果入口是./index
                replacedPath = ['./index-style-only'];// 替换入口为./index-style-only
            } else {
                console.log(
                    chalk.red(
                        '🆘 Seems entry has changed! It should be `./index`',
                    ),// 警告入口被修改
                );
            }

            config.entry[entryName.replace('da', `da.${theme}`)] =
                replacedPath;// 替换入口为 ui.${theme}
            delete config.entry[entryName];// 删除原始入口
        });

        injectLessVariables(config, vars);// 注入less变量
        config.plugins.push(// 添加插件
            new RemovePlugin({// 删除插件
                after: {// 删除条件
                    root: './dist',// 删除根目录下的文件
                    include: [// 删除以 ui 开头的文件
                        `da.${theme}.js`,
                        `da.${theme}.js.map`,// 删除以 ui 开头的文件
                        `da.${theme}.min.js`,
                        `da.${theme}.min.js.map`,// 删除以 ui 开头的文件
                    ],
                    log: false,// 打印删除信息
                    logWarning: false,// 打印警告信息
                },
            }),
        );
    });
}

/**
 *  获取webpack配置
 * @type {{"root-entry-name": string}}
 */
const legacyEntryVars = {// 旧版入口变量
    'root-entry-name': 'default',// 根入口名称
};
/**
 *  获取webpack配置
 */
const webpackConfig = injectLessVariables(
    getWebpackConfig(false),// 注入less变量
    legacyEntryVars,// 旧版入口变量
);
const webpackDarkConfig = injectLessVariables(
    getWebpackConfig(false),
    legacyEntryVars,
);
const webpackCompactConfig = injectLessVariables(
    getWebpackConfig(false),
    legacyEntryVars,
);
/**
 *   获取webpack配置
 * @type {{"root-entry-name": string}
 */
const webpackVariableConfig = injectLessVariables(getWebpackConfig(false), {
    'root-entry-name': 'variable',// 根入口名称
});
/**
 *    获取webpack配置
 */
webpackConfig.forEach((config) => {
    injectWarningCondition(config);// 注入警告条件
});

if (process.env.RUN_ENV === 'PRODUCTION') {
    webpackConfig.forEach((config) => {// 生产环境
        externalDayjs(config);// 外部引入dayjs
        addLocales(config);// 添加国际化
        config.optimization.usedExports = true;// 标记导出
        if (process.env.ESBUILD || process.env.CSB_REPO) {// esbuild压缩
            config.optimization.minimizer[0] = new ESBuildMinifyPlugin({// esbuild压缩
                target: 'es2015',// 目标js版本
                css: true,// 压缩css
            });
        }
        config.plugins.push(// 压缩图片
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',// 打包分析
                openAnalyzer: false,// 是否打开分析页面
                reportFilename: '../report.html',// 分析报告文件名
            }),
        );

        if (!process.env.NO_DUP_CHECK) {// 重复包检查
            config.plugins.push(
                new DuplicatePackageCheckerPlugin({// 重复包检查
                    verbose: true,// 是否输出详细信息
                    emitError: true,// 是否抛出错误
                }),
            );
        }
    });

    // processWebpackThemeConfig(webpackDarkConfig, 'dark', darkVars);// 处理暗黑主题配置
    processWebpackThemeConfig(webpackCompactConfig, 'compact', compactVars);// 处理紧凑主题配置
    processWebpackThemeConfig(webpackVariableConfig, 'variable', {});// 处理自定义主题配置
}

module.exports = [
    ...webpackConfig,// 处理普通主题配置
    ...webpackDarkConfig,// 处理暗黑主题配置
    ...webpackCompactConfig,//  处理紧凑主题配置
    ...webpackVariableConfig,// 处理自定义主题配置
];
