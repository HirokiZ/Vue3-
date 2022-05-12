const args = require("minimist")(process.argv.slice(2)) //运行node scripts/dev.js reactivity -f global(这些属性，都在进程的参数里)
const { build } = require('esbuild')
const { resolve } = require('path')
const target = args._[0] || 'reactivity';
const format = args.f || 'global'
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'


const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

//天生支持ts
build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.Name||'VueReactivity',
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {//监控文件变化
        onRebuild(error) {
            if (!error) console.log('rebuilt~')
        }
    }
}).then(() => {
    console.log('watching~')
})