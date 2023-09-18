const Conf = require('conf');
const path = require('path');

// 将查询结果保存在result目录下.
const customDirectory = path.dirname(require.main.filename) + "/results";

// 拼接配置文件的完整路径
const configPath = path.join(customDirectory, 'config.json');

// 创建 "conf" 实例并指定存储位置
const conf = new Conf({ projectName: 'httprequest', configName: 'config', cwd: customDirectory });

const chalk = require('chalk')

// axios发送异步请求
const axios = require('axios');

const cancelToken = axios.CancelToken;
let cancel;

// 设置请求超时阈值
let timeoutThreshold = 30;

async function httprequest(url) {
    try {
        let requestResults = conf.get('request-results')

        if (!requestResults) {
            requestResults = []
        }

        process.stdout.write(
            chalk.blue.bold('在获取服务器端的数据，请等待.')
        )

        // 启动计时器
        let count = 0;
        let timeout = false;
        const timer = setInterval(() => {
            count++;
            process.stdout.write(chalk.green.bold('.'));
            if (count >= timeoutThreshold) {
                clearInterval(timer);
                console.log(
                    chalk.red.bold('\nget ' + url + ' Connection timed out.')
                );
                timeout = true;
                requestResults.push({
                    url: url,
                    timeout: timeout,
                    context: 'null'
                })
                conf.set('request-results', requestResults)
                if (cancel) {
                    cancel('Request timed out');
                }
            }
        }, 500);

        // 发起 GET 请求（同时启动计时器）
        // 发起 GET 请求，并传递取消令牌
        const response = await axios.get(url, {
            cancelToken: new cancelToken(function executor(c) {
                // 将取消令牌赋值给 cancel 变量
                cancel = c;
            }),
        });
        if (response.status === 200) {
            console.log(
                chalk.green.bold('\nget ' + url + ' 成功.')
            );
            requestResults.push({
                url: url,
                timeout: timeout,
                context: response.headers
            })
            conf.set('request-results', requestResults)
            process.exit(0);
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            // console.log('请求已取消：', error.message);
            process.exit(0);
        } else {
            console.error('\n请求发生错误：', error);
            process.exit(1);
        }
    }
}

module.exports = httprequest