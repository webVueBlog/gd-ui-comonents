module.exports = {// 你的commitlint配置
    extends: ['@commitlint/config-conventional'],// 继承默认配置
    rules: {// 自定义规则
        'type-enum': [//, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
            2,// 错误级别
            'always',// 是否必须全部大写
            [
                'build', // 编译相关修改（新版本发布）
                'feat', // 新功能
                'fix', // 修复bug
                'update', // 更新某功能
                'refactor', // 重构
                'docs', // 文档
                'chore', // 增加依赖或库
                'style', // 格式（不影响代码变动）
                'revert', // 撤销commit 回滚上一版本
                'perf', // 性能优化
                'merge', // 代码合并
                'delete', // 删除
            ]
        ],
        'scope-case': [0],// 作用域大小写不做校验
    },
    plugins: [// 你的插件配置
        {
            rules: {// 自定义规则
                "commit-rule": ({ raw }) => {// 校验commit信息
                    return [
                        /^\[(build|feat|fix|update|refactor|docs|chore|style|revert|perf|merge|delete)].+/g.test(raw),
                        `commit备注信息格式错误，格式为 <[type] 修改内容>，type支持${types.join(",")}`
                    ]
                }
            }
        }
    ]
}