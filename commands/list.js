const Conf = require('conf');
const path = require('path');

// 自定义的存储目录
const customDirectory = path.dirname(require.main.filename) + "/results";

// 拼接配置文件的完整路径
const configPath = path.join(customDirectory, 'config.json');

// 创建 "conf" 实例并指定存储位置
const conf = new Conf({ projectName: 'httprequest', configName: 'config', cwd: customDirectory });

const chalk = require('chalk')

function list () {
    let requestResults = conf.get('request-results')

    if (requestResults && requestResults.length) {
        process.stdout.write(
            chalk.blue.bold('请求过的网站:')
        )
        process.stdout.write(
            chalk.green.bold(' (绿色为请求成功),')
        )
        process.stdout.write(
            chalk.red.bold(' (红色为请求超时)\n')
        )

        requestResults.forEach((url, index) => {
            if (url.timeout){
                console.log(
                    chalk.redBright(`${index}. ${url.url}`)
                )
            } else {
                console.log(
                    chalk.greenBright(`${index}. ${url.url}`)
                )
            }
        })
    } else {
        console.log(
            chalk.red.bold('从未发送过请求.')
        )
    }
}

module.exports = list