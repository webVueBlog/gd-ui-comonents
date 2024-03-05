import type { App } from 'vue';
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as components from './components';

export * from './components';// 导出所有组件

export const install = function (app: App) {// 安装插件
    Object.keys(components).forEach((key) => {// 遍历所有组件
        const component = components[key];// 获取组件
        if (component.install) {// 如果组件有install方法
            app.use(component);// 使用组件
        }
    });

    return app;// 返回app
};

export default { install };// 默认导出install方法
